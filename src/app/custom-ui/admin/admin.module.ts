import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '../shared/shared.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AddProductsComponent } from './warehouse-management/add-products/add-products.component';
import { CreateWarehouseComponent } from './warehouse-management/create-warehouse/create-warehouse.component';
import { SubordinateManagementModule } from './subordinate-management/subordinate-management.module';
import { WarehouseManagementModule } from './warehouse-management/warehouse-management.module';

@NgModule({
  declarations: [
    AddProductsComponent,
    CreateWarehouseComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AutocompleteLibModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    SubordinateManagementModule,
    WarehouseManagementModule,
    SharedModule
  ]
})
export class AdminModule { }
