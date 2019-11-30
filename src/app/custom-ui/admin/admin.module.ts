import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubordinateManagementModule } from './subordinate-management/subordinate-management.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from '../shared/shared.module';
import { GeneralManagementComponent } from './general-management/general-management.component';
import { TaskManagementModule } from '../warehouse/task-management/task-management.module';

@NgModule({
  declarations: [
    DashboardComponent,
    GeneralManagementComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    SharedModule,
    SubordinateManagementModule,
    TaskManagementModule
  ]
})
export class AdminModule { }
