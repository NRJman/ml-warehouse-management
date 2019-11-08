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
            fromSharedActions.finishInitializingAppState, // temporarily redundant;
            (state, action) => ({
                ...state
            })
        ),
        on(
            fromSharedActions.changeAppLoadingStatus,
            (state, action) => ({
                ...state,
                isAppLoading: action.payload
            })
        )
    )(sharedState, sharedAction);
}
