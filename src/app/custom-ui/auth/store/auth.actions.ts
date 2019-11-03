import { createAction, props } from '@ngrx/store';
import { RegistrationData } from '../../shared/models/registration-data.model';
import { TokenInfo } from '../../shared/models/token-info.model';
import { AuthenticationData } from '../../shared/models/authentication-data.model';
import { AuthenticationResponse } from '../../shared/models/authentication-response.model';

export const startSigningUp = createAction(
    '[Auth] Start Signing Up As Admin',
    props<{ payload: RegistrationData}>()
);
export const finishSigningUp = createAction(
    '[Auth] Finish Signing Up As Admin',
    props<{ payload: AuthenticationResponse }>()
);
export const failSigningUp = createAction(
    '[Auth] Fail Signing Up As Admin',
    props<{ payload: { message: string, error: object } }>()
);
export const startSigningIn = createAction(
    '[Auth] Start Signing In',
    props<{ payload: AuthenticationData}>()
);
export const finishSigningIn = createAction(
    '[Auth] Finish Signing In',
    props<{ payload: AuthenticationResponse }>()
);
export const failSigningIn = createAction(
    '[Auth] Fail Signing In',
    props<{ payload: { message: string, error: object } }>()
);
export const navigateAfterSuccessfulAuthentication = createAction(
    '[Auth] Navigate After Successful Authorization',
    props<{ payload: string }>()
);
