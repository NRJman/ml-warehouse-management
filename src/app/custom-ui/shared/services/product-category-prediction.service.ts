import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WAREHOUSES_API_SERVER_URL_TOKEN } from '../../../app.config';
import { ApiResponse } from '../models/api/api-response.model';
import { FormGroup } from '@angular/forms';
import { Area } from '../models/warehouse/area.model';

@Injectable()
export class ProductCategoryPredictionService {
    public predictionListsUpdateController$$: Subject<Area[][]> = new Subject();
    public warehouseAreas: Area[];
    private _areaListsMatchPredictedCategoryLists: Area[][] = [];

    constructor(
        private http: HttpClient,
        @Inject(WAREHOUSES_API_SERVER_URL_TOKEN) private warehousesApiServerUrl: string
    ) { }

    public predictProductCategory({ value: { description, brandName } }: FormGroup, productFormGroupPosition: number) {
        this.http.post<ApiResponse<string[]>>(
            `${this.warehousesApiServerUrl}/predict`,
            {
                description,
                brandName
            }
        ).subscribe(({ result }) => {
            const areaListMathesPredictedCategoryList: Area[] = result.map(
                (categoryPrediction: string) => this.warehouseAreas.find(
                    (area) => area.name === categoryPrediction
                )
            );

            this._areaListsMatchPredictedCategoryLists[productFormGroupPosition] = areaListMathesPredictedCategoryList;
            this.predictionListsUpdateController$$.next(this.areaListsMatchPredictedCategoryLists);
        });
    }

    public deletePredictionResultFromList(predictionResultPosition: number): void {
        this._areaListsMatchPredictedCategoryLists.splice(predictionResultPosition, 1);
        this.predictionListsUpdateController$$.next(this.areaListsMatchPredictedCategoryLists);
    }

    public get predictionListsMapUpdates$(): Observable<Area[][]> {
        return this.predictionListsUpdateController$$.asObservable();
    }

    public get areaListsMatchPredictedCategoryLists(): Area[][] {
        return this._areaListsMatchPredictedCategoryLists.slice();
    }
}
