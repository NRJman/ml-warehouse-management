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
import { HttpClient } from '@angular/common/http';

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
    private store: Store<fromApp.State>,
    private http: HttpClient
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

  public onInputScanChange(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    const fileReader: FileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      console.log(fileReader.result);

      this.http.post('http://localhost:3000/api/warehouses/extract', {
        fileBase64Code: fileReader.result
      }).subscribe(console.log);
    });

    if (file) {
      fileReader.readAsDataURL(file);
    }
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
