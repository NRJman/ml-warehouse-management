import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as fromSubordinateActions from './subordinate.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataToFetchSpecificProductInfo } from '../../shared/models/warehouse/data-to-fetch-specific-product-info.model';
import { WAREHOUSES_API_SERVER_URL_TOKEN } from '../../../app.config';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import { Product } from '../../shared/models/warehouse/product.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';

@Injectable()
export class SubordinateEffects {
    constructor(
        private http: HttpClient,
        private actions$: Actions,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string
    ) { }

    fetchSpecificProductInfo$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSubordinateActions.fetchSpecificProductInfo),
            map(action => action.payload),
            switchMap(({ warehouseId, productId }: DataToFetchSpecificProductInfo) =>
                this.http.get(`${this.warehousesApiServerUrl}/product/${warehouseId}/${productId}`).pipe(
                    map(({ result }: ApiResponse<Product>) =>
                        fromSubordinateActions.storeSpecificProductInfo({ payload: result })
                    ),
                    catchError((error: ApiResponseError) =>
                        of(fromSubordinateActions.failWarehouseManipulating({ payload: error }))
                    )
                )
            )
        )
    );
}
