import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWarehouse from './warehouse.reducer';

export const getWarehouseState = createFeatureSelector('warehouse');
export const getWarehouseId = createSelector(getWarehouseState, (warehouse: fromWarehouse.State) => warehouse.warehouseId);
export const getTasks = createSelector(getWarehouseState, (warehouse: fromWarehouse.State) => warehouse.tasks);
