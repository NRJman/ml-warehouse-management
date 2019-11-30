import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';
import { SharedModule } from '../../shared/shared.module';
import { TaskListComponent } from './task-list/task-list.component';



@NgModule({
  declarations: [
    CreateTasksComponent,
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
export class TaskManagementModule { }
