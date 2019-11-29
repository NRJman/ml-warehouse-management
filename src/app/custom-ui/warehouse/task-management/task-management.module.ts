import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    CreateTasksComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TaskManagementModule { }
