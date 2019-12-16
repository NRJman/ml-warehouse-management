import { Injectable, Inject } from '@angular/core';
import { WAREHOUSES_API_SERVER_URL_TOKEN } from '../../../app.config';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import * as fromWarehouseActions from './warehouse.actions';
import * as fromSharedActions from './../../shared/store/shared.actions';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { DataToCreateWarehouse } from '../../shared/models/warehouse/data-to-create-warehouse.model';
import { HttpClient } from '@angular/common/http';
import { WarehouseCreationResult } from '../../shared/models/warehouse/warehouse-creation-result.model';
import { ApiResponseError } from '../../shared/models/api/api-response-error.model';
import { of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api/api-response.model';
import * as fromAdminActions from './../../admin/store/admin.actions';
import { WarehouseDataFetchingResult } from '../../shared/models/warehouse/warehouse-data-fetching-result.model';
import { DataToAddProducts } from '../../shared/models/warehouse/data-to-add-products.model';
import { ProductsAdditionResult } from '../../shared/models/warehouse/products-addition-result.model';
import { DataToCreateTasks } from '../../shared/models/warehouse/data-to-create-tasks.model';
import { Task } from '../../shared/models/warehouse/task.model';
import { DataToFetchWarehouse } from '../../shared/models/warehouse/data-to-fetch-warehouse.model';
import { DataToUpdateTaskAssignee } from '../../shared/models/warehouse/data-to-update-task-assignee.model';
import { AssigneeUpdateResult } from '../../shared/models/warehouse/assignee-update-result.model';

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
                        of(fromWarehouseActions.failWarehouseManipulating({ payload: error }))
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
                        of(fromWarehouseActions.failWarehouseManipulating({ payload: error }))
                    )
                )
            )
        )
    );

    storeWarehouse$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.storeWarehouse),
            map(action => action.payload),
            map((userId: string) =>
                fromWarehouseActions.fetchWarehouseData({ payload: userId })
            )
        )
    );

    fetchWarehouseData$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.fetchWarehouseData),
            map(action => action.payload),
            switchMap((userId : string) =>
                this.http.get(this.warehousesApiServerUrl, { params: { userId } }).pipe(
                    map(({ result }: ApiResponse<WarehouseDataFetchingResult>) =>
                        fromWarehouseActions.storeWarehouseData({ payload: result })
                    ),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failWarehouseManipulating({ payload: error }))
                    )
                )
            ),
        )
    );

    startCreatingTasks$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.startCreatingTasks),
            map(action => action.payload),
            switchMap((data: DataToCreateTasks) =>
                this.http.post(`${this.warehousesApiServerUrl}/tasks`, {
                    warehouseId: data.warehouseId,
                    tasks: data.tasks
                }).pipe(
                    map(({ result }: ApiResponse<Task[]>) =>
                        fromWarehouseActions.storeTasksUpdateResult({ payload: result })
                    ),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failWarehouseManipulating({ payload: error }))
                    )
                )
            )
        )
    );

    startUpdatingTaskAssignee$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.startUpdatingTaskAssignee),
            map(action => action.payload),
            switchMap(({ taskId, warehouseId, userId }: DataToUpdateTaskAssignee) =>
                this.http.patch(`${this.warehousesApiServerUrl}/tasks/${taskId}/assignee`, {
                    warehouseId,
                    userId
                }).pipe(
                    map(({ result }: ApiResponse<AssigneeUpdateResult>) =>
                        fromWarehouseActions.storeTaskAssigneeUpdateResult({ payload: result })
                    ),
                    catchError((error: ApiResponseError) =>
                        of(fromWarehouseActions.failWarehouseManipulating({ payload: error }))
                    )
                )
            )
        )
    );

    failWarehouseManipulating$ = createEffect(
        () => this.actions$.pipe(
            ofType(fromWarehouseActions.failWarehouseManipulating),
            map(action => action.payload),
            tap(({ message, error }) => {
                console.log(message, error);
            })
        ),
        { dispatch: false }
    );
}
