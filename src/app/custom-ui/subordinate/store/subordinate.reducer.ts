import { Action, createReducer, on } from '@ngrx/store';
import * as fromSubordinateActions from './subordinate.actions';

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
        )
    )(subordinateState, subordinateAction);
}
