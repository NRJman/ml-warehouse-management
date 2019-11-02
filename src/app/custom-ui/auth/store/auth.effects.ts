import { Injectable, Inject } from '@angular/core';
import { createEffect, Actions, ofType, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromAuthActions from './auth.actions';
import * as fromAdminActions from './../../admin/store/admin.actions';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { RegistrationData } from '../../shared/models/registration-data.model';
import { USERS_API_SERVER_URL_TOKEN } from '../../../app.config';
import { AdminInfo } from '../../shared/models/admin-info.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TokenInfo } from '../../shared/models/token-info.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService,
        @Inject(USERS_API_SERVER_URL_TOKEN) private usersApiServerUrl: string
    ) {}

    startSignUpAsAdmin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAuthActions.startSignUpAsAdmin),
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
                        this.cookieService.set('Token', `${result.tokenInfo.token}`);
                        this.cookieService.set('ExpirationTime', `${result.tokenInfo.expirationTime}`);

                        return [
                            fromAdminActions.createAdmin({ payload: result.adminInfo }),
                            fromAuthActions.finishSignUpAsAdmin({ payload: result.tokenInfo }),
                            fromAuthActions.navigateAfterSuccessfulAuthorization({ payload: '/dashboard' })
                        ];
                    }),
                    catchError(error => {
                        return of(fromAuthActions.failSignUpAsAdmin(error));
                    })
                )
            )
        )
    );

    navigateAfterSuccessfulAuthorization$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromAuthActions.navigateAfterSuccessfulAuthorization),
            map(action => action.payload),
            tap(path => {
                this.router.navigate([path]);
            })
        ),
        { dispatch: false }
    );
}
