import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Unsubscriber } from '../../shared/services/unsubscriber.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAdmin from './../../admin/store/admin.reducer';
import * as fromWarehouse from './../../warehouse/store/warehouse.reducer';
import * as fromAdminSelectors from './../../admin/store/admin.selectors';
import * as fromWarehouseSelectors from './../../warehouse/store/warehouse.selectors';
import * as fromWarehouseActions from './../../warehouse/store/warehouse.actions';
import { Product } from '../../shared/models/warehouse/product.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductsComponent extends Unsubscriber implements OnInit, OnDestroy {
  public productsAdditionForm: FormGroup;
  public adminState: fromAdmin.State;
  public warehouseState: fromWarehouse.State;
  private predictionController$$: Subject<AbstractControl> = new Subject<AbstractControl>();

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) {
    super();
  }

  onProductsAdditionFormSubmit(): void {
    console.log(this.newProducts.controls);
    this.store.dispatch(fromWarehouseActions.startAddingProducts({
      payload: {
        productsDataList: this.newProducts.controls.map(productControl => productControl.value),
        warehouseId: this.warehouseState.warehouseId
      }
    }));
  }

  public addProduct(): void {
    const newProduct: FormGroup = new FormGroup({
      description: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(3),
        ],
        this.customValidatorsService.productDescriptionUniquenessValidator(this.newProducts.controls as FormGroup[])
      ),
      brandName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      count: new FormControl(0, [Validators.required]),
      areaId: new FormControl('', [Validators.required])
    });

    newProduct.get('description').valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(() => {
        this.newProducts.controls.forEach(productFormGroup => productFormGroup.get('description').updateValueAndValidity());
      });

    this.newProducts.push(newProduct);
  }

  public deleteProduct(productFormGroupPosition: number): void {
    this.newProducts.controls.splice(productFormGroupPosition, 1);
  }

  public get newProducts(): FormArray {
    return this.productsAdditionForm.get('newProducts') as FormArray;
  }

  public onDescriptionSuggestionSelect(selectedProduct: Product, productFormGroupPosition: number) {
    const productFormGroup: AbstractControl = this.newProducts.controls[productFormGroupPosition];

    productFormGroup.patchValue({
      description: selectedProduct.description,
      brandName: selectedProduct.brandName,
      areaId: selectedProduct.areaId
    });

    this.predictionController$$.next(productFormGroup);
  }

  public onDescriptionInputClear(productFormGroupPosition: number) {
    this.newProducts.controls[productFormGroupPosition].patchValue({
      description: '',
      brandName: '',
      areaId: ''
    });
  }

  public onDescriptionInputChange(description: string, productFormGroup: AbstractControl) {
    productFormGroup.patchValue({ description });

    this.predictionController$$.next(productFormGroup);
  }

  public onBrandNameInputFocusOut(productFormGroup: AbstractControl) {
    this.predictionController$$.next(productFormGroup);
  }

  ngOnInit(): void {
    this.productsAdditionForm = new FormGroup({
      newProducts: new FormArray([])
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

    this.predictionController$$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((productFormGroup: FormGroup) => {
        if (productFormGroup.get('description').invalid || productFormGroup.get('brandName').invalid) {
          return;
        }

        const { description, brandName } = productFormGroup.value;

        this.store.dispatch(fromWarehouseActions.startPredictingProductCategory({ payload: { description, brandName } }));
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
