import { Action, createReducer, on } from '@ngrx/store';
import * as fromAdminActions from './admin.actions';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';


export interface State {
    name: string;
    phone: number;
    userId: string;
    adminId: string;
    warehouseId: string;
    subordinates: SubordinateUser[];
}

export const initialState: State = {
    name: null,
    phone: null,
    userId: null,
    adminId: null,
    warehouseId: null,
    subordinates: [],
};

export function adminReducer(adminState: State | undefined, adminAction: Action) {
    return createReducer(
        initialState,
        on(
            fromAdminActions.storeGenericAdminData,
            fromAdminActions.storeSpecificAdminData,
            fromAdminActions.modifyAdminState,
                (state, action) => ({
                ...state,
                ...action.payload
            })
        ),
        on(
            fromAdminActions.resetAdminState,
            (state, action) => ({
                ...(action.payload ? action.payload : initialState)
            })
        ),
        on(
            fromAdminActions.finishSigningUpSubordinates,
            (state, action) => ({
                ...state,
                subordinates: action.payload
            })
        )
    )(adminState, adminAction);
}
