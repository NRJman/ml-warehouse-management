import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductActionsModalComponent } from './product-actions-modal/product-actions-modal.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProductActionsModalComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WarehouseManagementModule { }
