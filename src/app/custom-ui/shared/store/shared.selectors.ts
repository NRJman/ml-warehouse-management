import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromShared from './shared.reducer';

export const getSharedState = createFeatureSelector('shared');

export const getIsAppLoading = createSelector(
    getSharedState,
    (state: fromShared.State) => state.isAppLoading
);

export const getIsOnAuthFormPage = createSelector(
    getSharedState,
    (state: fromShared.State) => state.isOnAuthFormPage
);
