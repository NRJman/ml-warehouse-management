import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromAuthActions from './auth.actions';
import * as fromAdminActions from './../../admin/store/admin.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import * as fromSubordinateActions from './../../subordinate/store/subordinate.actions';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { RegistrationData } from '../../shared/models/auth/registration-data.model';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataToBeAuthenticated } from '../../shared/models/auth/data-to-be-authenticated.model';
import { Action } from '@ngrx/store';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import { UserDataInitType } from '../../shared/models/app/app-data-init-type.model';
import { User } from '../../shared/models/users/user.model';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersApiServerUrl: string
    ) {}

    startSigningUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAuthActions.startSigningUp),
            map(action => action.payload),
            switchMap((registrationData: RegistrationData) =>
                this.http.post(`${this.usersApiServerUrl}/signup`, {
                    ...registrationData
                }).pipe(
                    switchMap(({ result: { tokenInfo, user, isAdmin } }: ApiResponse<UserDataInitType>) => {
                        // Think about it:
                        const targetUserStoringAction: Action = (isAdmin)
                            ? fromAdminActions.storeAdmin({ payload: user })
                            : fromSubordinateActions.storeSubordinate({ payload: user as SubordinateUser });

                        this.saveTokenData(tokenInfo.token, tokenInfo.expirationTime);

                        return [
                            targetUserStoringAction,
                            fromAuthActions.finishSigningUp({
                                payload: {
                                    tokenInfo,
                                    isAdmin
                                }
                            }),
                            fromAuthActions.navigateAfterSuccessfulAuthActions({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => of(fromAuthActions.failSigningUp({ payload: error })))
                )
            )
        )
    );

    startSigningIn$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.startSigningIn),
            map(action => action.payload),
            switchMap((authenticationData: DataToBeAuthenticated) =>
                this.http.post(`${this.usersApiServerUrl}/signin`, {
                    ...authenticationData
                }).pipe(
                    switchMap(({ result: { tokenInfo, user, isAdmin } }: ApiResponse<UserDataInitType>) => {
                        const targetUserStoringAction: Action = (isAdmin)
                            ? fromAdminActions.storeAdmin({ payload: user })
                            : fromSubordinateActions.storeSubordinate({ payload: user as SubordinateUser });

                        this.saveTokenData(tokenInfo.token, tokenInfo.expirationTime);

                        return [
                            fromSharedActions.changeAppLoadingStatus({ payload: true }),
                            targetUserStoringAction,
                            fromAuthActions.finishSigningIn({
                                payload: {
                                    tokenInfo,
                                    isAdmin
                                }
                            }),
                            fromAuthActions.navigateAfterSuccessfulAuthActions({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => of(fromAuthActions.failSigningIn(error)))
                )
            )
        )
    );

    finishSigningIn$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.finishSigningIn),
            map(() => fromSharedActions.changeAppLoadingStatus({ payload: false }))
        )
    );

    signOut$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.signOut),
            switchMap(() => {
                this.cookieService.delete('Token');
                this.cookieService.delete('ExpirationTime');

                return [
                    fromAdminActions.resetAdminState(null),
                    fromSubordinateActions.resetSubordinateState(null),
                    fromSharedActions.resetSharedState(null),
                    fromAuthActions.navigateAfterSuccessfulAuthActions({ payload: '/sign-in' })
                ];
            })
        )
    );

    navigateAfterSuccessfulAuthActions$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.navigateAfterSuccessfulAuthActions),
            map(action => action.payload),
            map(path => {
                this.router.navigate([path]);

                return fromSharedActions.changeAuthFormPageStatus({ payload: false });
            })
        )
    );

    private saveTokenData(token: string, expirationTime: number): void {
        this.cookieService.set('Token', `${token}`);
        this.cookieService.set('ExpirationTime', `${expirationTime}`);
    }
}
