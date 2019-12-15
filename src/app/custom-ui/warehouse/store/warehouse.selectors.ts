import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWarehouse from './warehouse.reducer';

export const getWarehouseState = createFeatureSelector<fromWarehouse.State>('warehouse');
export const getWarehouseId = createSelector(getWarehouseState, warehouse => warehouse.warehouseId);
export const getTasks = createSelector(getWarehouseState, warehouse => warehouse.tasks);
