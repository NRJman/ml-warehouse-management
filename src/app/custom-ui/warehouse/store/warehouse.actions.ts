import { createAction, props } from '@ngrx/store';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import * as fromWarehouse from './warehouse.reducer';
import { DataToAddProducts } from '../../shared/models/warehouse/data-to-add-products.model';
import { ProductsAdditionResult } from '../../shared/models/warehouse/products-addition-result.model';
import { DataToPredictCategory } from '../../shared/models/warehouse/data-to-predict-category.model';
import { CategoryPredictionResult } from '../../shared/models/warehouse/category-prediction-result.model';

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

export const startAddingProducts = createAction(
    '[Warehouse] Start Adding Products',
    props<{ payload: DataToAddProducts }>()
);

export const finishAddingProducts = createAction(
    '[Warehouse] Finish Adding Products',
    props<{ payload: ProductsAdditionResult }>()
);

export const failAddingProducts = createAction(
    '[Warehouse] Fail Adding Products',
    props<{ payload: ApiResponseError }>()
);

export const startPredictingProductCategory = createAction(
    '[Warehouse] Start Predicting Product Category',
    props<{ payload: DataToPredictCategory }>()
);

export const finishPredictingProductCategory = createAction(
    '[Warehouse] Finish Predicting Product Category',
    props<{ payload: CategoryPredictionResult }>()
);

export const failPredictingProductCategory = createAction(
    '[Warehouse] Fail Predicting Product Category',
    props<{ payload: object }>()
);

export const storeWarehouse = createAction( // This action layer here is for consistency
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
