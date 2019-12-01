import { Action, createReducer, on } from '@ngrx/store';
import * as fromSubordinateActions from './subordinate.actions';
import { Product } from '../../shared/models/warehouse/product.model';

export interface State {
    name: string;
    phone: number;
    userId: string;
    warehouseId: string;
    scannedProductInfo: Product;
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    warehouseId: null,
    scannedProductInfo: null
};

export function subordinateReducer(subordinateState: State | undefined, subordinateAction: Action) {
    return createReducer(
        initialState,
        on(fromSubordinateActions.storeSubordinate, (state, action) => ({
            ...state,
            ...action.payload
        })),
        on(
            fromSubordinateActions.resetSubordinateState,
            (state, action) => ({
                ...state,
                ...(action.payload ? action.payload : initialState)
            })
        ),
        on(
            fromSubordinateActions.storeSpecificProductInfo,
            (state, action) => ({
                ...state,
                scannedProductInfo: action.payload
            })
        ),
        on(
            fromSubordinateActions.cleanSpecificProductInfo,
            (state, action) => ({
                ...state,
                scannedProductInfo: initialState.scannedProductInfo
            })
        )
    )(subordinateState, subordinateAction);
}
