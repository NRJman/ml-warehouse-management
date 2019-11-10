import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromWarehouseActions from './../store/warehouse.actions';
import * as fromAdminSelectors from './../../admin/store/admin.selectors';
import { Unsubscriber } from '../../shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent extends Unsubscriber implements OnInit, OnDestroy {
  public warehouseCreationForm: FormGroup;
  public adminId: string;

  constructor(
    private сustomValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) {
    super();
  }

  onWarehouseCreationFormSubmit(): void {
    this.store.dispatch(fromWarehouseActions.startCreatingWarehouse({
      payload: {
        adminId: this.adminId,
        areas: this.warehouseAreas.controls.map(
          areaFormControl => ({ name: areaFormControl.value as string })
        )
      }
    }));
  }

  public addArea(): void {
    this.warehouseAreas.push(new FormControl(
      null,
      [
        Validators.required,
        Validators.minLength(3)
      ],
      this.сustomValidatorsService.areaUniquenessValidator(this.warehouseAreas.controls)
    ));
  }

  public deleteArea(areaControlPosition: number): void {
    this.warehouseAreas.controls.splice(areaControlPosition, 1);
  }

  get warehouseAreas(): FormArray {
    return this.warehouseCreationForm.get('areas') as FormArray;
  }

  ngOnInit(): void {
    this.warehouseCreationForm = new FormGroup({
      areas: new FormArray([])
    });

    this.addArea();

    this.store
      .pipe(
        select(fromAdminSelectors.getAdminId),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(adminId => {
        this.adminId = adminId;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
