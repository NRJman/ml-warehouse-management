import { createAction, props } from '@ngrx/store';
import { RegistrationData } from '../../shared/models/registration-data.model';
import { TokenInfo } from '../../shared/models/token-info.model';
import { AuthenticationData } from '../../shared/models/authentication-data.model';

export const startSigningUpAsAdmin = createAction(
    '[Auth] Start Signing Up As Admin',
    props<{ payload: RegistrationData}>()
);
export const finishSigningUpAsAdmin = createAction(
    '[Auth] Finish Signing Up As Admin',
    props<{ payload: TokenInfo }>()
);
export const failSigningUpAsAdmin = createAction(
    '[Auth] Fail Signing Up As Admin',
    props<{ payload: { message: string, error: object } }>()
);
export const startSigningIn = createAction(
    '[Auth] Start Signing In',
    props<{ payload: AuthenticationData}>()
);
export const finishSigningIn = createAction(
    '[Auth] Finish Signing In',
    props<{
        payload: {
            tokenInfo: TokenInfo,
            isAdmin: boolean
        }
    }>()
);
export const failSigningIn = createAction(
    '[Auth] Fail Signing In',
    props<{ payload: { message: string, error: object } }>()
);
export const navigateAfterSuccessfulAuthentication = createAction(
    '[Auth] Navigate After Successful Authorization',
    props<{ payload: string }>()
);
