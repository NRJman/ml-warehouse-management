import { createAction, props } from '@ngrx/store';
import { TokenInfo } from '../models/auth/token-info.model';
import { ApiResponseError } from '../models/api/api-response-error.model';

export const startInitializingAppState = createAction(
    '[Shared] Start Initializing App State',
    props<{ payload: TokenInfo }>()
);

export const finishInitializingAppState = createAction(
    '[Shared] Finish Initializing App State'
);

export const failInitializingAppState = createAction(
    '[Shared] Fail To Initialize App State',
    props<{ payload: ApiResponseError }>()
);

export const changeAppLoadingStatus = createAction(
    '[Shared] Change App Loading State',
    props<{ payload: boolean }>()
);
