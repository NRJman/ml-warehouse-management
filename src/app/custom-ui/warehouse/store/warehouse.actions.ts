import { createAction, props } from '@ngrx/store';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';

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
