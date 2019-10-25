import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import * as fromAuthActions from './auth.actions';
import { switchMap } from 'rxjs/operators';
import { RegistrationData } from '../../shared/models/registration-data.model';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private http: HttpClient) {}

    startSignUp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fromAuthActions.startSignUp),
            switchMap((registrationData: RegistrationData) => {
                return [fromAuthActions.finishSignUp(null)];
            })
        )
    );
}
