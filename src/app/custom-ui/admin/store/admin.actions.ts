import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/users/user.model';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';

export const fetchSpecificAdminData = createAction('[Admin] Fetch Admin Information', props<{ payload: string }>());
export const failFetchingSpecificAdminData = createAction(
    '[Admin] Fail To Fetch Admin Information',
    props<{ payload: { message: string, error: object } }>()
);
export const storeAdmin = createAction('[Admin] Store Admin Data', props<{ payload: User }>());
export const storeGenericAdminData = createAction('[Admin] Store Generic Part Of Admin Data', props<{ payload: User }>());
export const storeSpecificAdminData = createAction(
    '[Admin] Store Specific Part Of Admin Data',
    props<{ payload: { [property: string]: SubordinateUser[] }}>()
);
