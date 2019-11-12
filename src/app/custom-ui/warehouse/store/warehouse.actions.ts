import { createAction, props } from '@ngrx/store';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import * as fromWarehouse from './warehouse.reducer';

export const startCreatingWarehouse = createAction(
    '[Warehouse] Start Creating Warehouse',
    props<{ payload: DataToCreateWarehouse }>()
);

export const finishCreatingWarehouse = createAction(
    '[Warehouse] Finish Creating Warehouse',
    props<{ payload: WarehouseCreationResult }>()
);

export const failCreatingWarehouse = createAction(
    '[Warehouse] Fail Creating Warehouse',
    props<{ payload: ApiResponseError }>()
);

// This action layer here is for consistency:
export const storeWarehouse = createAction(
    '[Warehouse] Store Warehouse',
    props<{ payload: string }>()
);

export const fetchWarehouseData = createAction(
    '[Warehouse] Fetch Warehouse Data',
    props<{ payload: string }>()
);

export const failFetchingWarehouseData = createAction(
    '[Warehouse] Fail Fetching Warehouse Data',
    props<{ payload: ApiResponseError }>()
);

export const storeWarehouseData = createAction(
    '[Warehouse] Store Warehouse Data',
    props<{ payload: WarehouseDataFetchingResult }>()
);

export const resetWarehouseState = createAction(
    '[Warehouse] Reset Warehouse State',
    props<{ payload: fromWarehouse.State }>()
);
