import { Action, createReducer, on } from '@ngrx/store';
import * as fromAuthActions from './auth.actions';

export interface State {
    accessToken: string;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export const initialState: State = {
    accessToken: null,
    isAuthenticated: false,
    isAdmin: null
};

export function authReducer(authState: State | undefined, authAction: Action) {
    return createReducer(
        initialState,
        on(fromAuthActions.finishSignUpAsAdmin, (state, action) => ({
            ...state,
            isAuthenticated: true,
            isAdmin: true,
            accessToken: action.payload
        }))
    )(authState, authAction);
}
