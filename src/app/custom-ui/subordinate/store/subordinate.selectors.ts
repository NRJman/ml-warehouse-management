import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubordinate from './subordinate.reducer';

export const getSubordinateState = createFeatureSelector('subordinate');

export const getWarehouseId = createSelector(
    getSubordinateState,
    (state: fromSubordinate.State) => state.warehouseId
);

export const getScannedProductInfo = createSelector(
    getSubordinateState,
    (state: fromSubordinate.State) => state.scannedProductInfo
);
