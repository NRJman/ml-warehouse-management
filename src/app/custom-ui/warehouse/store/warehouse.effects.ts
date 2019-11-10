import { Injectable, Inject } from '@angular/core';
import { WAREHOUSES_API_SERVER_URL_TOKEN, WAREHOUSES_API_SERVER_URL } from '../../../app.config';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as fromWarehouseActions from './warehouse.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { HttpClient } from '@angular/common/http';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import * as fromAdminActions from './../../admin/store/admin.actions';

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
                    switchMap(({ result }: ApiResponse<WarehouseCreationResult>) => {
                        return [
                            fromWarehouseActions.finishCreatingWarehouse({ payload: result }),
                            fromAdminActions.modifyAdminState({
                                payload: {
                                    warehouseId: result.warehouseId
                                }
                            }),
                            fromSharedActions.navigate({ payload: '/dashboard' })
                        ];
                    }),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failCreatingWarehouse({ payload: error }))
                    )
                )
            )
        )
    );
}
