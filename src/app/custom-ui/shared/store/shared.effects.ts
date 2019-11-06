import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as fromSharedActions from './shared.actions';
import * as fromAuthActions from './../../auth/store/auth.actions';
import * as fromAdminActions from '../../admin/store/admin.actions';
import * as fromSubordinateActions from '../../subordinate/store/subordinate.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Action } from '@ngrx/store';
import { ApiResponse } from '../models/api/api-response.model';
import { UserDataInitType } from '../models/app/app-data-init-type.model';
import { SubordinateUser } from '../models/users/subordinate-user.model';
import { TokenInfo } from '../models/auth/token-info.model';

@Injectable()
export class SharedEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private cookieService: CookieService,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersApiServerUrl: string
    ) {}

    startInitializingAppState$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSharedActions.startInitializingAppState),
            map(action => action.payload),
            switchMap((tokenInfo: TokenInfo) =>
                this.http.get(`${this.usersApiServerUrl}/init`, {
                    headers: new HttpHeaders({
                        authorization: `Bearer ${tokenInfo.token}`
                    })
                }).pipe(
                    switchMap(({ result: { user, isAdmin } }: ApiResponse<UserDataInitType>) => {
                        const targetUserStoringAction: Action = (isAdmin)
                            ? fromAdminActions.storeAdmin({ payload: user })
                            : fromSubordinateActions.storeSubordinate({ payload: user as SubordinateUser });

                        return [
                            targetUserStoringAction,
                            fromAuthActions.finishSigningIn({
                                payload: {
                                    tokenInfo,
                                    isAdmin
                                }
                            }),
                            fromSharedActions.finishInitializingAppState(),
                            fromAuthActions.navigateAfterSuccessfulAuthentication({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => of(fromSharedActions.failInitializingAppState(error)))
                )
            )
        )
    );

    private saveTokenInformation(token, expirationTime): void {
        this.cookieService.set('Token', `${token}`);
        this.cookieService.set('ExpirationTime', `${expirationTime}`);
    }
}
