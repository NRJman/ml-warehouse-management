import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductActionsModalComponent } from './product-actions-modal/product-actions-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { AvailableTasksComponent } from './available-tasks/available-tasks.component';

@NgModule({
  declarations: [ProductActionsModalComponent, AvailableTasksComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WarehouseManagementModule { }
