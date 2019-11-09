import { createAction, props } from '@ngrx/store';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';
import * as fromWarehouse from './warehouse.reducer';

export const storeSubordinate = createAction(
    '[Warehouse] Store Subordinate Data',
    props<{ payload: SubordinateUser }>()
);
