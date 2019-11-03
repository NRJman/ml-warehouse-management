import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromAuthActions from './auth.actions';
import * as fromAdminActions from './../../admin/store/admin.actions';
import * as fromSubordinateActions from './../../subordinate/store/subordinate.actions';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { RegistrationData } from '../../shared/models/auth/registration-data.model';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { Admin } from '../../shared/models/users/admin.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TokenInfo } from '../../shared/models/auth/token-info.model';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationData } from '../../shared/models/auth/authentication-data.model';
import { Subordinate } from '../../shared/models/users/subordinate.model';
import { Action } from '@ngrx/store';

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
                    switchMap(({ result: { tokenInfo, user } }: {
                        result: {
                            tokenInfo: TokenInfo,
                            user: Admin | Subordinate
                        }
                    }) => {
                        const isAdmin: boolean = user.isAdmin;
                        const targetuserStoringAction = (isAdmin)
                            ? fromAdminActions.storeAdmin({ payload: user as Admin })
                            : fromSubordinateActions.storeSubordinate({ payload: user as Subordinate });

                        this.saveTokenInformation(tokenInfo.token, tokenInfo.expirationTime);

                        return [
                            targetuserStoringAction,
                            fromAuthActions.finishSigningUp({
                                payload: {
                                    tokenInfo,
                                    isAdmin
                                }
                            }),
                            fromAuthActions.navigateAfterSuccessfulAuthentication({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => {
                        return of(fromAuthActions.failSigningUp(error));
                    })
                )
            )
        )
    );

    startSigningIn$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.startSigningIn),
            map(action => action.payload),
            switchMap((authenticationData: AuthenticationData) =>
                this.http.post(`${this.usersApiServerUrl}/signin`, {
                    ...authenticationData
                }).pipe(
                    switchMap(({ result: { tokenInfo, user } }: {
                        result: {
                            tokenInfo: TokenInfo,
                            user: Admin | Subordinate
                        }
                    }) => {
                        const isAdmin: boolean = user.isAdmin;
                        const targetuserStoringAction: Action = (isAdmin)
                            ? fromAdminActions.storeAdmin({ payload: user as Admin })
                            : fromSubordinateActions.storeSubordinate({ payload: user as Subordinate });

                        this.saveTokenInformation(tokenInfo.token, tokenInfo.expirationTime);

                        return [
                            targetuserStoringAction,
                            fromAuthActions.finishSigningIn({
                                payload: {
                                    tokenInfo: tokenInfo,
                                    isAdmin
                                }
                            }),
                            fromAuthActions.navigateAfterSuccessfulAuthentication({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => {
                        return of(fromAuthActions.failSigningIn(error));
                    })
                )
            )
        )
    );

    navigateAfterSuccessfulAuthentication$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.navigateAfterSuccessfulAuthentication),
            map(action => action.payload),
            tap(path => {
                this.router.navigate([path]);
            })
        ),
        { dispatch: false }
    );

    private saveTokenInformation(token, expirationTime): void {
        this.cookieService.set('Token', `${token}`);
        this.cookieService.set('ExpirationTime', `${expirationTime}`);
    }
}
