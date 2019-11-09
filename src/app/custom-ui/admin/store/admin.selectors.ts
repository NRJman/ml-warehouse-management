import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdmin from './admin.reducer';

export const getAdminState = createFeatureSelector('admin');
export const getAdminId = createSelector(getAdminState, (state: fromAdmin.State) => state.adminId);
