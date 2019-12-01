import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubordinateManagementComponent } from './subordinate-management.component';
import { SignUpSubordinatesComponent } from './sign-up-subordinates/sign-up-subordinates.component';
import { SubordinateListComponent } from './subordinate-list/subordinate-list.component';
import { SharedModule } from '../../shared/shared.module';
import { WarehouseManagementModule } from '../warehouse-management/warehouse-management.module';

@NgModule({
  declarations: [
    SubordinateManagementComponent,
    SignUpSubordinatesComponent,
    SubordinateListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WarehouseManagementModule
  ]
})
export class SubordinateManagementModule { }
