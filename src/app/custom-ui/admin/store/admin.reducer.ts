import { Action, createReducer, on } from '@ngrx/store';
import * as fromAuthActions from './admin.actions';
import { Task } from '../../shared/models/task.model';

export interface State {
    name: string;
    phone: number;
    userId: string;
    adminId: string;
    warehouseId: string;
    subordinateIds: string[];
    tasksList: Task[];
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    adminId: null,
    warehouseId: null,
    subordinateIds: null,
    tasksList: null
};

export function adminReducer(authState: State | undefined, authAction: Action) {
    return createReducer(
        initialState,
        on(fromAuthActions.createAdmin, (state, action) => ({
            ...state,
            ...action.payload
        }))
    )(authState, authAction);
}
