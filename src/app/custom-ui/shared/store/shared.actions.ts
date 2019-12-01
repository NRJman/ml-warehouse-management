import { createAction, props } from '@ngrx/store';
import { TokenInfo } from '../models/auth/token-info.model';
import { ApiResponseError } from '../models/api/api-response-error.model';
import * as fromShared from './shared.reducer';

export const prepareForStartingAppStateInitialization = createAction(
    '[Shared] Prepare for Starting App State Initialization',
    props<{ payload: TokenInfo }>()
);

export const startInitializingAppState = createAction(
    '[Shared] Start Initializing App State',
    props<{ payload: TokenInfo }>()
);

export const failInitializingAppState = createAction(
    '[Shared] Fail To Initialize App State',
    props<{ payload: ApiResponseError }>()
);

export const changeAppLoadingStatus = createAction(
    '[Shared] Change App Loading State',
    props<{ payload: boolean }>()
);

export const changeAuthFormPageStatus = createAction(
    '[Shared] Change Auth Form Page Status',
    props<{ payload: boolean }>()
);

export const resetSharedState = createAction(
    '[Shared] Reset Shared State',
    props<{ payload: fromShared.State }>()
);

export const navigate = createAction(
    '[Shared] Navigate',
    props<{ payload: string }>()
);
