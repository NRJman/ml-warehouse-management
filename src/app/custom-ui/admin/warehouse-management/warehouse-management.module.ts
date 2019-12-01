import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { SharedModule } from '../../shared/shared.module';
import { TaskListComponent } from './task-list/task-list.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';

@NgModule({
  declarations: [
    CreateTasksComponent,
    AddProductsComponent,
    CreateWarehouseComponent,
    TaskListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    TaskListComponent
  ]
})
export class WarehouseManagementModule { }
