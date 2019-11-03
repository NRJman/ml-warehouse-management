import { Action, createReducer, on } from '@ngrx/store';
import * as fromSubordinateActions from './subordinate.actions';
import { Task } from '../../shared/models/warehouse/task.model';

export interface State {
    name: string;
    phone: number;
    userId: string;
    warehouseId: string;
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    warehouseId: null,
};

export function adminReducer(subordinateState: State | undefined, subordinateAction: Action) {
    return createReducer(
        initialState,
        on(fromSubordinateActions.storeSubordinate, (state, action) => ({
            ...state,
            name: action.payload.name,
            phone: action.payload.phone,
            userId: action.payload.userId,
            warehouseId: action.payload.warehouseId
        }))
    )(subordinateState, subordinateAction);
}
