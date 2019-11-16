import { Injectable, Inject } from '@angular/core';
import { WAREHOUSES_API_SERVER_URL_TOKEN, WAREHOUSES_API_SERVER_URL } from '../../../app.config';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as fromWarehouseActions from './warehouse.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import * as fromAdminActions from './../../admin/store/admin.actions';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import { DataToAddProducts } from '../../shared/models/warehouse/data-to-add-products.model';
import { ProductsAdditionResult } from '../../shared/models/warehouse/products-addition-result.model';

@Injectable()
export class WarehouseEffects {
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string
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

    startAddingPorducts$ = createEffect(
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
