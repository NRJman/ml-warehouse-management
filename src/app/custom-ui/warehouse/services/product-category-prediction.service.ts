import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { WAREHOUSES_API_SERVER_URL_TOKEN } from '../../../app.config';
import { ApiResponse } from '../../shared/models/api/api-response.model';

@Injectable()
export class ProductCategoryPredictionService {
    public predictionListsMapUpdateController$$: Subject<WeakMap<AbstractControl, string[]>> = new Subject();
    private predictionListsMap: WeakMap<AbstractControl, string[]> = new WeakMap();

    constructor(
        private http: HttpClient,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string
    ) { }

    public predictProductCategory(productFormGroup: AbstractControl) {
        const { description, brandName }: any = productFormGroup.value;

        this.http.post<ApiResponse<string[]>>(
            `${this.warehousesApiServerUrl}/predict`,
            {
                description,
                brandName
            }
        ).subscribe(({ result }) => {
            this.predictionListsMap.set(productFormGroup, result);
            this.predictionListsMapUpdateController$$.next(this.predictionListsMap);
        });
    }

    public get predictionListsMapUpdates$(): Observable<WeakMap<AbstractControl, string[]>> {
        return this.predictionListsMapUpdateController$$.asObservable();
    }
}
