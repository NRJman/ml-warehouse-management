import { Action, createReducer, on } from '@ngrx/store';
import * as fromAdminActions from './admin.actions';
import { Task } from '../../shared/models/task.model';

export interface State {
    name: string;
    phone: number;
    userId: string;
    adminId: string;
    warehouseId: string;
    subordinateIds: string[];
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    adminId: null,
    warehouseId: null,
    subordinateIds: null,
};

export function adminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(fromAdminActions.storeAdminInfo, (state, action) => ({
            ...state,
            name: action.payload.name,
            phone: action.payload.phone,
            userId: action.payload.userId,
            adminId: action.payload.adminId,
            warehouseId: action.payload.warehouseId,
            subordinateIds: action.payload.subordinateIds
        }))
    )(adminState, adminAction);
}
