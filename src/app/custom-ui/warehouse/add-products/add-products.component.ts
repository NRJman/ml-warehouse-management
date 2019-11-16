import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Area } from '../../shared/models/warehouse/area.model';
import { Unsubscriber } from '../../shared/services/unsubscriber.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAdmin from './../../admin/store/admin.reducer';
import * as fromWarehouse from './../../warehouse/store/warehouse.reducer';
import * as fromAdminSelectors from './../../admin/store/admin.selectors';
import * as fromWarehouseSelectors from './../../warehouse/store/warehouse.selectors';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent extends Unsubscriber implements OnInit, OnDestroy {
  public productsAdditionForm: FormGroup;
  public adminState: fromAdmin.State;
  public warehouseState: fromWarehouse.State;

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) {
    super();
  }

  onProductsAdditionFormSubmit(): void {
    console.log(this.productsAdditionForm);
  }

  public addProduct(): void {
    const newProduct: FormGroup = new FormGroup({
      description: new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(3),
        ],
        this.customValidatorsService.productDescriptionUniquenessValidator(this.products.controls as FormGroup[])
      ),
      brandName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      count: new FormControl(null, [Validators.required]),
      category: new FormControl('', [Validators.required])
    });

    newProduct.get('description').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(() => {
        this.products.controls.forEach(productFormGroup => productFormGroup.get('description').updateValueAndValidity());
      });

    this.products.push(newProduct);
  }

  public deleteProduct(productFormGroupPosition: number): void {
    this.products.controls.splice(productFormGroupPosition, 1);
  }

  public get products(): FormArray {
    return this.productsAdditionForm.get('products') as FormArray;
  }

  onCategorySelect(productFormGroupPosition: number): void {
    this.products.controls[productFormGroupPosition].get('category').updateValueAndValidity();
  }

  ngOnInit(): void {
    this.productsAdditionForm = new FormGroup({
      products: new FormArray([])
    });

    this.addProduct();

    this.store
      .pipe(
        select(fromAdminSelectors.getAdminState)
      )
      .subscribe((state: fromAdmin.State) => {
        this.adminState = state;
      });

    this.store
      .pipe(
        select(fromWarehouseSelectors.getWarehouseState)
      )
      .subscribe((state: fromWarehouse.State) => {
        this.warehouseState = state;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
