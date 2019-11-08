import { Action, createReducer, on } from '@ngrx/store';
import * as fromSharedActions from './shared.actions';


export interface State {
    isAppLoading: boolean;
    isOnAuthFormPage: boolean;
}

export const initialState: State = {
    isAppLoading: false,
    isOnAuthFormPage: false
};

export function sharedReducer(sharedState: State | undefined, sharedAction: Action) {
    return createReducer(
        initialState,
        on(
            fromSharedActions.changeAppLoadingStatus,
            (state, action) => ({
                ...state,
                isAppLoading: action.payload
            })
        ),
        on(
            fromSharedActions.changeAuthFormPageStatus,
            (state, action) => ({
                ...state,
                isOnAuthFormPage: action.payload
            })
        ),
        on(
            fromSharedActions.resetSharedState,
            (state, action) => ({
                ...state,
                ...(action.payload ? action.payload : initialState)
            })
        )
    )(sharedState, sharedAction);
}
