import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubordinate from './subordinate.reducer';

export const getSubordinateState = createFeatureSelector<fromSubordinate.State>('subordinate');

export const getSubordinateId = createSelector(
    getSubordinateState,
    state => state.userId
);

export const getWarehouseId = createSelector(
    getSubordinateState,
    state => state.warehouseId
);

export const getScannedProductInfo = createSelector(
    getSubordinateState,
    state => state.scannedProductInfo
);
