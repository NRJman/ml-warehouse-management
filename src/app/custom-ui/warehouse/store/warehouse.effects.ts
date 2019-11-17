import { Injectable, Inject } from '@angular/core';
import { WAREHOUSES_API_SERVER_URL_TOKEN, WAREHOUSES_API_SERVER_URL } from '../../../app.config';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as fromWarehouseActions from './warehouse.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import * as fromAdminActions from './../../admin/store/admin.actions';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import { DataToAddProducts } from '../../shared/models/warehouse/data-to-add-products.model';
import { ProductsAdditionResult } from '../../shared/models/warehouse/products-addition-result.model';
import { DataToPredictCategory } from '../../shared/models/warehouse/data-to-predict-category.model';
import { PREDICTING_AUTH_TOKEN, PREDICTING_URL_TOKEN } from '../../../app-sensitive.config';
import { ProductPredictingRequestBody } from '../../shared/models/warehouse/pruduct-predicting-request-body.model';
import { CategoryPredictionResult } from '../../shared/models/warehouse/category-prediction-result.model';

@Injectable()
export class WarehouseEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string,
        @Inject(PREDICTING_AUTH_TOKEN) private predictingAuth: string,
        @Inject(PREDICTING_URL_TOKEN) private predictingUrl: string
    ) {}

    startCreatingWarehouse$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.startCreatingWarehouse),
            map(action => action.payload),
            switchMap((data: DataToCreateWarehouse) =>
                this.http.post(this.warehousesApiServerUrl, data).pipe(
                    switchMap(({ result }: ApiResponse<WarehouseCreationResult>) => [
                        fromWarehouseActions.finishCreatingWarehouse({ payload: result }),
                        fromAdminActions.modifyAdminState({
                            payload: {
                                warehouseId: result.warehouseId
                            }
                        }),
                        fromSharedActions.navigate({ payload: '/dashboard' })
                    ]),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failCreatingWarehouse({ payload: error }))
                    )
                )
            )
        )
    );

    startAddingProducts$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.startAddingProducts),
            map(action => action.payload),
            switchMap((data: DataToAddProducts) =>
                this.http.post(`${this.warehousesApiServerUrl}/products`, data).pipe(
                    switchMap(({ result }: ApiResponse<ProductsAdditionResult>) => [
                        fromWarehouseActions.finishAddingProducts({ payload: result }),
                        fromSharedActions.navigate({ payload: '/dashboard' })
                    ]),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failAddingProducts({ payload: error }))
                    )
                )
            )
        )
    );

    startPredictingProductCategory$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.startPredictingProductCategory),
            map(action => action.payload),
            switchMap((data: DataToPredictCategory) => {
                const requestBody: ProductPredictingRequestBody = {
                    Inputs: {
                        input1: {
                            subcategory: '',
                            item_name: data.description,
                            merchant_brand_name: data.brandName
                        }
                    }
                };

                return this.http.post(this.predictingUrl, requestBody, {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${this.predictingAuth}`
                    }),
                    params: {
                        'api-version': '2.0',
                        'format': 'swagger'
                    }
                }).pipe(
                    switchMap((result: CategoryPredictionResult) => {
                        console.log(result);

                        return [fromWarehouseActions.finishPredictingProductCategory(null)];
                    }),
                    catchError(error => of(fromWarehouseActions.failPredictingProductCategory({ payload: error })))
                );
            })
        )
    );

    storeWarehouse$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.storeWarehouse),
            map(action => action.payload),
            map((idOfUserResponsibleForWarehouse: string) => {
                return fromWarehouseActions.fetchWarehouseData({ payload: idOfUserResponsibleForWarehouse });
            })
        )
    );

    fetchWarehouseData$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.fetchWarehouseData),
            map(action => action.payload),
            switchMap((idOfUserResponsibleForWarehouse: string) =>
                this.http.get(this.warehousesApiServerUrl, {
                    params: {
                        userId: idOfUserResponsibleForWarehouse
                    }
                }).pipe(
                    map(({ result }: ApiResponse<WarehouseDataFetchingResult>) => {
                        return fromWarehouseActions.storeWarehouseData({ payload: result });
                    }),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failCreatingWarehouse({ payload: error }))
                    )
                )
            ),
        )
    );
}
