import { createAction, props } from '@ngrx/store';
import { DataToBeAuthenticated } from '../../shared/models/auth/data-to-be-authenticated.model';
import { AuthenticationResult } from '../../shared/models/auth/authentication-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { RegistrationSubordinateUsersData } from '../../shared/models/auth/registration-subordinate-users-data.model';
import { RegistrationAdminUserData } from '../../shared/models/auth/registration-admin-user-data.model';

export const startSigningUpAdmin = createAction(
    '[Auth] Start Signing Up Admin',
    props<{ payload: RegistrationAdminUserData}>()
);

export const finishSigningUpAdmin = createAction(
    '[Auth] Finish Signing Up Admin',
    props<{ payload: AuthenticationResult }>()
);

export const failSigningUpAdmin = createAction(
    '[Auth] Fail Signing Up Admin',
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

export const signOut = createAction('[Auth] Sign Out');

export const navigateAfterSuccessfulAuthActions = createAction(
    '[Auth] Navigate After Successful Auth Actions',
    props<{ payload: string }>()
);
