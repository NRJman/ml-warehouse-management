import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const getAuthState = createFeatureSelector('auth');
export const getAccessToken = createSelector(getAuthState, (state: fromAuth.State) => state.accessToken);
export const getAuthStatus = createSelector(getAuthState, (state: fromAuth.State) => state.isAuthenticated);
