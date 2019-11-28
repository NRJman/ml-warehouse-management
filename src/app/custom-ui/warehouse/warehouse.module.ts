import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { SharedModule } from '../shared/shared.module';
import { AddProductsComponent } from './add-products/add-products.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ProductCategoryPredictionService } from './services/product-category-prediction.service';

@NgModule({
  declarations: [
    CreateWarehouseComponent,
    AddProductsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedModule,
    AutocompleteLibModule
  ],
  providers: [
    ProductCategoryPredictionService
  ]
})
export class WarehouseModule { }
