import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as fromSubordinateActions from './subordinate.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataToFetchSpecificProductInfoByText } from '../../shared/models/warehouse/data-to-fetch-specific-product-info-by-text.model';
import { WAREHOUSES_API_SERVER_URL_TOKEN } from '../../../app.config';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import { Product } from '../../shared/models/warehouse/product.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';
import { DataToFetchSpecificProductInfoByPhoto } from '../../shared/models/warehouse/data-to-fetch-specific-product-info-by-photo.model';

@Injectable()
export class SubordinateEffects {
    constructor(
        private http: HttpClient,
        private actions$: Actions,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string
    ) { }

    fetchSpecificProductInfoByText$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSubordinateActions.fetchSpecificProductInfoByText),
            map(action => action.payload),
            switchMap(({ warehouseId, productId }: DataToFetchSpecificProductInfoByText) =>
                this.http.get(`${this.warehousesApiServerUrl}/${warehouseId}/product/${productId}`).pipe(
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

    fetchSpecificProductInfoByPhoto$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromSubordinateActions.fetchSpecificProductInfoByPhoto),
            map(action => action.payload),
            switchMap(({ warehouseId, fileBase64Code }: DataToFetchSpecificProductInfoByPhoto) =>
                this.http.post(`${this.warehousesApiServerUrl}/${warehouseId}/product/`, {
                    fileBase64Code
                }).pipe(
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
