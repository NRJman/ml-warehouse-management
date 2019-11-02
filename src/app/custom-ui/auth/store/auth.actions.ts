import { createAction, props } from '@ngrx/store';
import { RegistrationData } from '../../shared/models/registration-data.model';
import { TokenInfo } from '../../shared/models/token-info.model';

export const startSignUpAsAdmin = createAction(
    '[Auth] Start Signing Up As Admin',
    props<{ payload: RegistrationData}>()
);
export const finishSignUpAsAdmin = createAction(
    '[Auth] Finish Signing Up As Admin',
    props<{ payload: TokenInfo }>()
);
export const failSignUpAsAdmin = createAction(
    '[Auth] Fail Signing Up As Admin',
    props<{ payload: { message: string, error: object } }>()
);
export const navigateAfterSuccessfulAuthorization = createAction(
    '[Auth] Navigate After Successful Authorization',
    props<{ payload: string }>()
);
