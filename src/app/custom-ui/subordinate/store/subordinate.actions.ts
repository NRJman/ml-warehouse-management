import { createAction, props } from '@ngrx/store';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';
import * as fromSubordinate from './subordinate.reducer';

export const storeSubordinate = createAction(
    '[Subordinate] Store Subordinate Data',
    props<{ payload: SubordinateUser }>()
);

export const resetSubordinateState = createAction(
    '[Subordinate] Reset SUbordinate State',
    props<{ payload: fromSubordinate.State }>()
);
