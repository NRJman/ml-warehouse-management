import { createAction, props } from '@ngrx/store';
import { Admin } from '../../shared/models/users/admin.model';
import { Subordinate } from '../../shared/models/users/subordinate.model';

export const storeAdmin = createAction('[Admin] Store Admin Information', props<{ payload: Admin }>());
export const storeAdminProperty = createAction(
    '[Admin] Store Admin Property',
    props<{ payload: { [property: string]: string | number | Subordinate[] }}>()
);
export const fetchAdmin = createAction('[Admin] Fetch Admin Information', props<{ payload: string }>());
export const failFetchingAdmin = createAction(
    '[Admin] Fail To Fetch Admin Information',
    props<{ payload: { message: string, error: object } }>()
);
