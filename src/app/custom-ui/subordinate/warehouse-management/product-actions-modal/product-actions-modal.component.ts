import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as fromApp from './../../../../store/app.reducers';
import * as fromSubordinateActions from './../../store/subordinate.actions';
import * as fromSubordinateSelectors from './../../store/subordinate.selectors';
import { Store, select } from '@ngrx/store';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../../shared/models/warehouse/product.model';

@Component({
  selector: 'app-product-actions-modal',
  templateUrl: './product-actions-modal.component.html',
  styleUrls: ['./product-actions-modal.component.scss']
})
export class ProductActionsModalComponent extends Unsubscriber implements OnInit, OnDestroy {
  public productIdForm: FormGroup;
  public warehouseId: string;
  public scannedProductInfo: Product;
  public isAutomaticEntering = true;

  constructor(
    public bsModalRef: BsModalRef,
    private store: Store<fromApp.State>
  ) {
    super();
  }

  public onProductIdFormSubmit(): void {
    this.store.dispatch(
      fromSubordinateActions.fetchSpecificProductInfo({
        payload: {
          warehouseId: this.warehouseId,
          productId: this.productIdForm.value.productId
        }
      })
    );
  }

  public switchToManualEntering(): void {
    this.isAutomaticEntering = false;
  }

  ngOnInit() {
    this.productIdForm = new FormGroup({
      productId: new FormControl(null, Validators.required)
    });

    this.store
      .pipe(
        select(fromSubordinateSelectors.getWarehouseId),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(warehouseId => {
        this.warehouseId = warehouseId;
      });

    this.store
      .pipe(
        select(fromSubordinateSelectors.getScannedProductInfo),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(scannedProductInfo => {
        this.scannedProductInfo = scannedProductInfo;
      });
  }
}
