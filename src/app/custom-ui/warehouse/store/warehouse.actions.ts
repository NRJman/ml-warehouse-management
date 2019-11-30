import { createAction, props } from '@ngrx/store';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import * as fromWarehouse from './warehouse.reducer';
import { DataToAddProducts } from '../../shared/models/warehouse/data-to-add-products.model';
import { ProductsAdditionResult } from '../../shared/models/warehouse/products-addition-result.model';
import { DataToCreateTasks } from '../../shared/models/warehouse/data-to-create-tasks.model';
import { Task } from '../../shared/models/warehouse/task.model';

export const startCreatingWarehouse = createAction(
    '[Warehouse] Start Creating Warehouse',
    props<{ payload: DataToCreateWarehouse }>()
);

export const finishCreatingWarehouse = createAction(
    '[Warehouse] Finish Creating Warehouse',
    props<{ payload: WarehouseCreationResult }>()
);

export const startAddingProducts = createAction(
    '[Warehouse] Start Adding Products',
    props<{ payload: DataToAddProducts }>()
);

export const finishAddingProducts = createAction(
    '[Warehouse] Finish Adding Products',
    props<{ payload: ProductsAdditionResult }>()
);

export const storeWarehouse = createAction( // This action layer here is for consistency
    '[Warehouse] Store Warehouse',
    props<{ payload: string }>()
);

export const fetchWarehouseData = createAction(
    '[Warehouse] Fetch Warehouse Data',
    props<{ payload: string }>()
);

export const storeWarehouseData = createAction(
    '[Warehouse] Store Warehouse Data',
    props<{ payload: WarehouseDataFetchingResult }>()
);

export const resetWarehouseState = createAction(
    '[Warehouse] Reset Warehouse State',
    props<{ payload: fromWarehouse.State }>()
);

export const startCreatingTasks = createAction(
    '[Warehouse] Start Creating Tasks',
    props<{ payload: DataToCreateTasks }>()
);

export const finishCreatingTasks = createAction(
    '[Warehouse] Finish Creating Tasks',
    props<{ payload: Task[] }>()
);

export const failWarehouseManipulating = createAction(
    '[Warehouse] Fail Warehouse Manipulating',
    props<{ payload: ApiResponseError }>()
);
