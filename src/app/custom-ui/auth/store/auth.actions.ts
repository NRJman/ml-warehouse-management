import { createAction, props } from '@ngrx/store';
import { RegistrationData } from '../../shared/models/registration-data.model';

export const startSignUp = createAction('[Auth] Start Sign Up', props<RegistrationData>());
export const finishSignUp = createAction('[Auth] Finish Sign Up', props<{ accessToken: string }>());
export const navigateAfterSuccessfulAuthorization = createAction(
    '[Auth] Navigate After Successful Authorization',
    props<{ path: string }>()
);
