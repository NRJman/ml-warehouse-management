import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/users/user.model';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import * as fromAdmin from './admin.reducer';
import { AdminSpecificDataFetchingResult } from '../../shared/models/users/admin-specific-data-fetching-result.model';

export const fetchSpecificAdminData = createAction(
    '[Admin] Fetch Specific Part Of Admin Data',
    props<{ payload: string }>()
);

export const failFetchingSpecificAdminData = createAction(
    '[Admin] Fail To Fetch Admin Information',
    props<{ payload: ApiResponseError }>()
);

export const storeAdmin = createAction(
    '[Admin] Store Admin Data',
    props<{ payload: User }>()
);

export const storeGenericAdminData = createAction(
    '[Admin] Store Generic Part Of Admin Data',
    props<{ payload: User }>()
);

export const storeSpecificAdminData = createAction(
    '[Admin] Store Specific Part Of Admin Data',
    props<{ payload: AdminSpecificDataFetchingResult}>()
);

export const resetAdminState = createAction(
    '[Admin] Reset Admin State',
    props<{ payload: fromAdmin.State }>()
);
