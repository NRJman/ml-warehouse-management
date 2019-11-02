import { Action, createReducer, on } from '@ngrx/store';
import * as fromAuthActions from './auth.actions';

export interface State {
    accessToken: string;
    expirationTime: number;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const initialState: State = {
    accessToken: null,
    expirationTime: null,
    isAuthenticated: false,
    isAdmin: null
};

export function authReducer(authState: State | undefined, authAction: Action) {
    return createReducer(
        initialState,
        on(fromAuthActions.finishSigningUpAsAdmin, (state, action) => ({
            ...state,
            accessToken: action.payload.token,
            expirationTime: action.payload.expirationTime,
            isAuthenticated: true,
            isAdmin: true,
        }))
    )(authState, authAction);
}
