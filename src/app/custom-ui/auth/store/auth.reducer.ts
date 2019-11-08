import { Action, createReducer, on } from '@ngrx/store';
import * as fromAuthActions from './auth.actions';

export interface State {
    accessToken: string;
    expirationTime: number;
    isAdmin: boolean;
    isAuthenticated: boolean;
}

export const initialState: State = {
    accessToken: null,
    expirationTime: null,
    isAdmin: null,
    isAuthenticated: false
};

export function authReducer(authState: State | undefined, authAction: Action) {
    return createReducer(
        initialState,
        on(
            fromAuthActions.finishSigningUp,
            fromAuthActions.finishSigningIn,
            (state, action) => ({
                ...state,
                accessToken: action.payload.tokenInfo.token,
                expirationTime: action.payload.tokenInfo.expirationTime,
                isAdmin: action.payload.isAdmin,
                isAuthenticated: true,
            })
        ),
        on(
            fromAuthActions.signOut,
            (state, action) => ({
                ...initialState
            })
        )
    )(authState, authAction);
}
