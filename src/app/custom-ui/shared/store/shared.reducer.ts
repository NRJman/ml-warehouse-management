import { Action, createReducer, on } from '@ngrx/store';
import * as fromSharedActions from './shared.actions';


export interface State {
    isAppLoading: boolean;
}

export const initialState: State = {
    isAppLoading: false
};

export function sharedReducer(sharedState: State | undefined, sharedAction: Action) {
    return createReducer(
        initialState,
        on(
            fromSharedActions.startInitializingAppState,
            (state, action) => ({
                ...state,
                isAppLoading: true
            })
        ),
        on(
            fromSharedActions.finishInitializingAppState,
            (state, action) => ({
                ...state,
                isAppLoading: false
            })
        )
    )(sharedState, sharedAction);
}
