import { createAction, props } from '@ngrx/store';
import { Subordinate } from '../../shared/models/users/subordinate.model';

export const storeSubordinate = createAction(
    '[Admin] Store Subordinate Information',
    props<{ payload: Subordinate }>()
);
