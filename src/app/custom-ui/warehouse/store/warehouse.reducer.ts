import { Action, createReducer, on } from '@ngrx/store';
import * as fromWarehouseActions from './warehouse.actions';

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

export function warehouseReducer(warehouseState: State | undefined, warehouseAction: Action) {
    return createReducer(
        initialState,
        on(fromWarehouseActions.storeSubordinate, (state, action) => ({
            ...state,
            ...action.payload
        }))
    )(warehouseState, warehouseAction);
}
