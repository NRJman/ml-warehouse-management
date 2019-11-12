import { Injectable, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as fromAdminActions from './admin.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ADMINS_API_SERVER_URL_TOKEN, USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import { User } from '../../shared/models/users/user.model';
import { AdminSpecificDataFetchingResult } from '../../shared/models/users/admin-specific-data-fetching-result.model';
import { RegistrationSubordinateUsersData } from '../../shared/models/auth/registration-subordinate-users-data.model';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';

@Injectable()
export class AdminEffects {
    constructor(
        private actions$: Actions,
        private cookieService: CookieService,
        private http: HttpClient,
        @Inject(ADMINS_API_SERVER_URL_TOKEN) private adminsApiServerUrl: string,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersApiServerUrl: string
    ) { }

    storeAdmin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAdminActions.storeAdmin),
            map(action => action.payload),
            switchMap((user: User) => [
                fromAdminActions.storeGenericAdminData({ payload: user }),
                fromAdminActions.fetchSpecificAdminData({ payload: user.userId })
            ])
        )
    );

    fetchSpecificAdminData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAdminActions.fetchSpecificAdminData),
            map(action => action.payload),
            switchMap(userId => this.http.get(`${this.adminsApiServerUrl}/${userId}`, {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${this.cookieService.get('Token')}`
                })
            }).pipe(
                map(({ result }: ApiResponse<AdminSpecificDataFetchingResult>) => {
                    return fromAdminActions.storeSpecificAdminData({ payload: result });
                }),
                catchError(error => of(fromAdminActions.failFetchingSpecificAdminData({ payload: error })))
            ))
        )
    );

    startSigningUpSubordinates$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAdminActions.startSigningUpSubordinates),
            map(action => action.payload),
            switchMap(({ registrationDataList, warehouseId, adminId }: RegistrationSubordinateUsersData) =>
                this.http.post(`${this.usersApiServerUrl}/signup/subordinates`, {
                    registrationDataList,
                    warehouseId,
                    adminId
                }).pipe(
                    switchMap(({ result }: ApiResponse<SubordinateUser[]>) => [
                        fromAdminActions.finishSigningUpSubordinates({ payload: result }),
                        fromSharedActions.navigate({ payload: '/dashboard' })
                    ]),
                    catchError(error => of(fromAdminActions.failSigningUpSubordinates({ payload: error })))
                )
            )
        )
    );
}
