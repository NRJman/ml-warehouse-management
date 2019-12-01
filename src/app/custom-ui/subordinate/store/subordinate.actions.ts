import { createAction, props } from '@ngrx/store';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';
import * as fromSubordinate from './subordinate.reducer';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { Product } from '../../shared/models/warehouse/product.model';
import { DataToFetchSpecificProductInfo } from '../../shared/models/warehouse/data-to-fetch-specific-product-info.model';

export const storeSubordinate = createAction(
    '[Subordinate] Store Subordinate Data',
    props<{ payload: SubordinateUser }>()
);

export const resetSubordinateState = createAction(
    '[Subordinate] Reset Subordinate State',
    props<{ payload: fromSubordinate.State }>()
);

export const fetchSpecificProductInfo = createAction(
    '[Subordinate] Fetch Specific Product Info',
    props<{ payload: DataToFetchSpecificProductInfo }>()
);

export const storeSpecificProductInfo = createAction(
    '[Subordinate] Store Specific Product Info',
    props<{ payload: Product }>()
);

export const cleanSpecificProductInfo = createAction(
    '[Subordinate] Clean Specific Product Info'
);

export const failWarehouseManipulating = createAction(
    '[Subordinate] Reset SUbordinate State',
    props<{ payload: ApiResponseError }>()
);
