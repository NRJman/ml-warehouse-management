import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpSubordinatesComponent } from './sign-up-subordinates/sign-up-subordinates.component';
import { SharedModule } from '../../shared/shared.module';
import { SubordinateListComponent } from './subordinate-list/subordinate-list.component';

@NgModule({
  declarations: [
    SignUpSubordinatesComponent,
    SubordinateListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    SubordinateListComponent
  ]
})
export class SubordinateManagementModule { }
