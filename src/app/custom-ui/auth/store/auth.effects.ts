import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromAuthActions from './auth.actions';
import * as fromAdminActions from './../../admin/store/admin.actions';
import * as fromSubordinateActions from './../../subordinate/store/subordinate.actions';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { RegistrationData } from '../../shared/models/registration-data.model';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { AdminInfo } from '../../shared/models/admin-info.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TokenInfo } from '../../shared/models/token-info.model';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationData } from '../../shared/models/authentication-data.model';
import { SubordinateInfo } from '../../shared/models/subordinate-info.model';
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

    startSigningUpAsAdmin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAuthActions.startSigningUpAsAdmin),
            map(action => action.payload),
            switchMap((registrationData: RegistrationData) =>
                this.http.post(`${this.usersApiServerUrl}/signup`, {
                    ...registrationData
                }).pipe(
                    switchMap(({ result }: {
                        result: {
                            tokenInfo: TokenInfo,
                            adminInfo: AdminInfo
                        }
                    }) => {
                        this.saveTokenInformation(result.tokenInfo.token, result.tokenInfo.expirationTime);

                        return [
                            fromAdminActions.storeAdminInfo({ payload: result.adminInfo }),
                            fromAuthActions.finishSigningUpAsAdmin({ payload: result.tokenInfo }),
                            fromAuthActions.navigateAfterSuccessfulAuthentication({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => {
                        return of(fromAuthActions.failSigningUpAsAdmin(error));
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
                    switchMap(({ result }: {
                        result: {
                            tokenInfo: TokenInfo,
                            userInfo: AdminInfo | SubordinateInfo
                        }
                    }) => {
                        const isAdmin: boolean = result.userInfo.isAdmin;
                        let targetUserInfoStoringAction: Action;

                        if (isAdmin) {
                            targetUserInfoStoringAction = fromAdminActions.storeAdminInfo({
                                payload: result.userInfo as AdminInfo
                            });
                        } else {
                            targetUserInfoStoringAction = fromSubordinateActions.storeSubordinateInfo({
                                payload: result.userInfo as SubordinateInfo
                            });
                        }

                        this.saveTokenInformation(result.tokenInfo.token, result.tokenInfo.expirationTime);

                        return [
                            targetUserInfoStoringAction,
                            fromAuthActions.finishSigningIn({
                                payload: {
                                    tokenInfo: result.tokenInfo,
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
