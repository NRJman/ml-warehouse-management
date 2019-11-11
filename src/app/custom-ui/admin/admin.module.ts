import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpSubordinatesComponent } from './sign-up-subordinates/sign-up-subordinates.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [SignUpSubordinatesComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AdminModule { }
