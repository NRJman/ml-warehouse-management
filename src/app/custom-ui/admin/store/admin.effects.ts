import { Injectable, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as fromAdmin from './admin.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ADMINS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import { Subordinate } from '../../shared/models/users/subordinate.model';

@Injectable()
export class AdminEffects {
    constructor(
        private actions$: Actions,
        private cookieService: CookieService,
        private http: HttpClient,
        @Inject(ADMINS_API_SERVER_URL_TOKEN) private adminsApiServerUrl: string
    ) { }

    fetchAdmin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAdmin.fetchAdmin),
            map(action => action.payload),
            switchMap(userId => this.http.get(`${this.adminsApiServerUrl}/${userId}`, {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${this.cookieService.get('Token')}`
                })
            }).pipe(
                map(({ result }: ApiResponse<{ subordinates: Subordinate[] }>) => {
                    return fromAdmin.storeAdminProperty({ payload: result });
                }),
                catchError(error => of(fromAdmin.failFetchingAdmin({ payload: error })))
            ))
        )
    );
}
