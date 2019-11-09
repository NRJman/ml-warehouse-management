import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CreateWarehouseComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class WarehouseModule { }
