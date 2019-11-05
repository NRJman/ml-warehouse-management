import { createAction, props } from '@ngrx/store';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';

export const storeSubordinate = createAction(
    '[Admin] Store Subordinate Data',
    props<{ payload: SubordinateUser }>()
);
