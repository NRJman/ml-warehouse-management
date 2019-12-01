import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as fromSharedActions from './shared.actions';
import * as fromAuthActions from './../../auth/store/auth.actions';
import * as fromAdminActions from '../../admin/store/admin.actions';
import * as fromSubordinateActions from '../../subordinate/store/subordinate.actions';
import * as fromWarehouseActions from './../../warehouse/store/warehouse.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ApiResponse } from '../models/api/api-response.model';
import { UserDataInitType } from '../models/app/app-data-init-type.model';
import { SubordinateUser } from '../models/users/subordinate-user.model';
import { TokenInfo } from '../models/auth/token-info.model';
import { Router } from '@angular/router';
import { ApiResponseError } from '../models/api/api-response-error.model';

@Injectable()
export class SharedEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersApiServerUrl: string
    ) {}

    prepareForStartingAppStateInitialization$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSharedActions.prepareForStartingAppStateInitialization),
            map(action => action.payload),
            switchMap((tokenInfo) => [
                fromAuthActions.resetAccessToken({ payload: tokenInfo.token }),
                fromSharedActions.startInitializingAppState({ payload: tokenInfo })
            ])
        )
    );

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
                        const actionsToDispatch: Action[] = [
                            (isAdmin)
                                ? fromAdminActions.storeAdmin({ payload: user })
                                : fromSubordinateActions.storeSubordinate({ payload: user as SubordinateUser }),
                            fromWarehouseActions.storeWarehouse({ payload: user.userId }),
                            fromAuthActions.finishSigningIn({
                                payload: {
                                    tokenInfo,
                                    isAdmin
                                }
                            })
                        ];

                        if (this.router.url === '/') {
                            actionsToDispatch.push(
                                fromAuthActions.navigateAfterSuccessfulAuthActions({ payload: '/dashboard' })
                            );
                        }

                        return actionsToDispatch;
                    }),
                    catchError((error: ApiResponseError) =>
                        of(fromSharedActions.failInitializingAppState({ payload: error }))
                    )
                )
            )
        )
    );

    navigate$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSharedActions.navigate),
            map(action => action.payload),
            tap(path => {
                this.router.navigate([path]);
            })
        ),
        { dispatch: false }
    );
}
