import { Action, createReducer, on } from '@ngrx/store';
import * as fromWarehouseActions from './warehouse.actions';
import { Area } from '../../shared/models/warehouse/area.model';
import { Product } from '../../shared/models/warehouse/product.model';
import { Task } from '../../shared/models/warehouse/task.model';

export interface State {
    areas: Area[];
    products: Product[];
    tasks: Task[];
    adminId: string;
    warehouseId: string;
}

export const initialState: State = {
    areas: [],
    products: [],
    tasks: [],
    adminId: null,
    warehouseId: null,
};

export function warehouseReducer(warehouseState: State | undefined, warehouseAction: Action) {
    return createReducer(
        initialState,
        on(
            fromWarehouseActions.finishCreatingWarehouse,
            fromWarehouseActions.storeWarehouseData,
            (state, action) => ({
                ...state,
                ...action.payload
            })
        ),
        on(
            fromWarehouseActions.resetWarehouseState,
            (state, action) => ({
                ...state,
                ...(action.payload ? action.payload : initialState)
            })
        ),
        on(
            fromWarehouseActions.finishCreatingTasks,
            (state, action) => ({
                ...state,
                tasks: action.payload
            })
        )
    )(warehouseState, warehouseAction);
}
