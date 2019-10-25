import { Action, createReducer, on } from '@ngrx/store';
import * as fromAuthActions from './auth.actions';

export interface State {
    accessToken: string;
    isAuthenticated: boolean;
}

export const initialState: State = {
    accessToken: null,
    isAuthenticated: false
}

export function authReducer(authState: State | undefined, authAction: Action) {
    return createReducer(
        initialState,
        on(fromAuthActions.finishSignUp, (state, action) => ({
            ...state,
            accessToken: action.accessToken,
            isAuthenticated: true
        }))
    )(authState, authAction);
}