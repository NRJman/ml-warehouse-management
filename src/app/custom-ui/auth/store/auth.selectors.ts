import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getAccessToken = createSelector(getAuthState, (state) => state.accessToken);
export const getAuthStatus = createSelector(getAuthState, (state) => state.isAuthenticated);
export const getAdminStatus = createSelector(getAuthState, (state) => state.isAdmin);
