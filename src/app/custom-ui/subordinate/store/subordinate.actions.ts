import { createAction, props } from '@ngrx/store';
import { SubordinateUser } from '../../shared/models/users/subordinate-user.model';
import * as fromSubordinate from './subordinate.reducer';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { Product } from '../../shared/models/warehouse/product.model';
import { DataToFetchSpecificProductInfoByText } from '../../shared/models/warehouse/data-to-fetch-specific-product-info-by-text.model';
import { DataToFetchSpecificProductInfoByPhoto } from '../../shared/models/warehouse/data-to-fetch-specific-product-info-by-photo.model';

export const storeSubordinate = createAction(
    '[Subordinate] Store Subordinate Data',
    props<{ payload: SubordinateUser }>()
);

export const resetSubordinateState = createAction(
    '[Subordinate] Reset Subordinate State',
    props<{ payload: fromSubordinate.State }>()
);

export const fetchSpecificProductInfoByText = createAction(
    '[Subordinate] Fetch Specific Product Info By Id',
    props<{ payload: DataToFetchSpecificProductInfoByText }>()
);

export const fetchSpecificProductInfoByPhoto = createAction(
    '[Subordinate] Fetch Specific Product Info By Photo',
    props<{ payload: DataToFetchSpecificProductInfoByPhoto }>()
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
