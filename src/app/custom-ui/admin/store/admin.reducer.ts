import { Action, createReducer, on } from '@ngrx/store';
import * as fromAdminActions from './admin.actions';
import { Task } from '../../shared/models/warehouse/task.model';
import { Subordinate } from '../../shared/models/users/subordinate.model';

export interface State {
    name: string;
    phone: number;
    userId: string;
    adminId: string;
    warehouseId: string;
    subordinates: Subordinate[];
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    adminId: null,
    warehouseId: null,
    subordinates: null,
};

export function adminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(
            fromAdminActions.storeAdmin,
            fromAdminActions.storeAdminProperty,
                (state, action) => ({
                ...state,
                ...action.payload
            })
        )
    )(adminState, adminAction);
}
