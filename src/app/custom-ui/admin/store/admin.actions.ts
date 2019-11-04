import { createAction, props } from '@ngrx/store';
import { Admin } from '../../shared/models/users/admin.model';

export const storeAdmin = createAction('[Admin] Store Admin Information', props<{ payload: Admin }>());
export const fetchAdmin = createAction('[Admin] Fetch Admin Information', props<{ payload: string }>());
export const failFetchingAdmin = createAction(
    '[Admin] Fail To Fetch Admin Information',
    props<{ payload: { message: string, error: object } }>()
);
