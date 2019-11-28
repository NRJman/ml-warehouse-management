import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Unsubscriber } from '../../shared/services/unsubscriber.service';
import { debounceTime, distinctUntilChanged, takeUntil, filter, switchMap, withLatestFrom, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAdmin from './../../admin/store/admin.reducer';
import * as fromWarehouse from './../../warehouse/store/warehouse.reducer';
import * as fromAdminSelectors from './../../admin/store/admin.selectors';
import * as fromWarehouseSelectors from './../../warehouse/store/warehouse.selectors';
import * as fromWarehouseActions from './../../warehouse/store/warehouse.actions';
import { Product } from '../../shared/models/warehouse/product.model';
import { Subject, of, zip } from 'rxjs';
import { PredictionControllerInput } from '../../shared/models/warehouse/prediction-controller-input.model';
import { ProductCategoryPredictionService } from '../services/product-category-prediction.service';

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
  public predictionListsMap: WeakMap<AbstractControl, string[]> = new WeakMap();
  private predictionController$$: Subject<PredictionControllerInput> = new Subject<PredictionControllerInput>();

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>,
    private productCategoryPredictionService: ProductCategoryPredictionService
  ) {
    super();
  }

  public onProductsAdditionFormSubmit(): void {
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
    const productFormGroup: AbstractControl = this.getProduct(productFormGroupPosition);

    productFormGroup.patchValue({
      description: selectedProduct.description,
      brandName: selectedProduct.brandName,
      areaId: selectedProduct.areaId
    });

    this.startPrediction(productFormGroup, productFormGroupPosition);
  }

  public onDescriptionInputClear(productFormGroupPosition: number) {
    this.newProducts.controls[productFormGroupPosition].patchValue({
      description: '',
      brandName: '',
      areaId: ''
    });
  }

  public onDescriptionInputChange(description: string, productFormGroupPosition: number) {
    const productFormGroup: AbstractControl = this.getProduct(productFormGroupPosition);

    productFormGroup.patchValue({ description });

    this.startPrediction(productFormGroup, productFormGroupPosition);
  }

  public onBrandNameInputChange(productFormGroupPosition: number) {
    const productFormGroup: AbstractControl = this.getProduct(productFormGroupPosition);

    this.startPrediction(productFormGroup, productFormGroupPosition);
  }

  private getProduct(productFormGroupPosition: number) {
    return this.newProducts.controls[productFormGroupPosition];
  }

  private startPrediction(productFormGroup: AbstractControl, productFormGroupPosition: number) {
    this.predictionController$$.next({
      productValue: { ...productFormGroup.value },
      productFormGroupPosition
    });
  }

  ngOnInit(): void {
    this.productsAdditionForm = new FormGroup({
      newProducts: new FormArray([])
    });

    this.addProduct();

    this.store
      .pipe(
        select(fromAdminSelectors.getAdminState),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((state: fromAdmin.State) => {
        this.adminState = state;
      });

    this.store
      .pipe(
        select(fromWarehouseSelectors.getWarehouseState),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((state: fromWarehouse.State) => {
        this.warehouseState = state;
      });

    this.productCategoryPredictionService.predictionListsMapUpdates$
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(predictionListsMapUpdates => {
        console.log(predictionListsMapUpdates);
      });

    this.predictionController$$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(({ productValue: previousValue }, { productValue: currentValue }) => {
          const isBrandNameRetainedSame = previousValue.brandName === currentValue.brandName;
          const isDescriptionRetainedSame = previousValue.description === currentValue.description;

          return isBrandNameRetainedSame && isDescriptionRetainedSame;
        }),
        switchMap(({ productFormGroupPosition }: PredictionControllerInput) => {
          const productFormGroup = this.getProduct(productFormGroupPosition);

          if (productFormGroup.status === 'PENDING') {
            return zip(of(productFormGroup), productFormGroup.statusChanges);
          }

          return zip(of(productFormGroup), of(null));
        }),
        map(([productFormGroup]: [AbstractControl, string]) => {
          return productFormGroup;
        }),
        filter((productFormGroup) => {
          return productFormGroup.get('description').valid && productFormGroup.get('brandName').valid;
        }),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((productFormGroup) => {
        this.productCategoryPredictionService.predictProductCategory(productFormGroup);
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
