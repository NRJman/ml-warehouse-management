import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdmin from './admin.reducer';

export const getAdminState = createFeatureSelector('admin');
export const getUserId = createSelector(getAdminState, (state: fromAdmin.State) => state.userId);
export const getAdminId = createSelector(getAdminState, (state: fromAdmin.State) => state.adminId);
export const getWarehouseId = createSelector(getAdminState, (state: fromAdmin.State) => state.warehouseId);
export const getSubordinates = createSelector(getAdminState, (state: fromAdmin.State) => state.subordinates);
