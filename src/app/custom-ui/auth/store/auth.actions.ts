import { createAction, props } from '@ngrx/store';
import { RegistrationData } from '../../shared/models/auth/registration-data.model';
import { DataToBeAuthenticated } from '../../shared/models/auth/data-to-be-authenticated.model';
import { AuthenticationResult } from '../../shared/models/auth/authentication-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import * as fromAuth from './auth.reducer';

export const startSigningUp = createAction(
    '[Auth] Start Signing Up',
    props<{ payload: RegistrationData}>()
);

export const finishSigningUp = createAction(
    '[Auth] Finish Signing Up',
    props<{ payload: AuthenticationResult }>()
);

export const failSigningUp = createAction(
    '[Auth] Fail Signing Up',
    props<{ payload: ApiResponseError }>()
);

export const startSigningIn = createAction(
    '[Auth] Start Signing In',
    props<{ payload: DataToBeAuthenticated}>()
);

export const finishSigningIn = createAction(
    '[Auth] Finish Signing In',
    props<{ payload: AuthenticationResult }>()
);

export const failSigningIn = createAction(
    '[Auth] Fail Signing In',
    props<{ payload: ApiResponseError }>()
);

export const navigateAfterSuccessfulAuthActions = createAction(
    '[Auth] Navigate After Successful Auth Actions',
    props<{ payload: string }>()
);

export const signOut = createAction('[Auth] Sign Out');
