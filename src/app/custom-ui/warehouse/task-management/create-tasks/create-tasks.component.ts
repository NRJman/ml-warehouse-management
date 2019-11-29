import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../../store/app.reducers';
import * as fromAdminSelectors from './../../../admin/store/admin.selectors';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-tasks',
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.scss']
})
export class CreateTasksComponent extends Unsubscriber implements OnInit, OnDestroy {
  public tasksCreationForm: FormGroup;
  public adminId: string;

  constructor(
    private store: Store<fromApp.State>
  ) {
    super();
  }

  onTasksCreationFormSubmit(): void {
    console.log(this.tasksCreationForm);
  }

  public addTask(): void {
    const newTask: FormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);

    this.newTasks.push(newTask);
  }

  public deleteTask(taskControlPosition: number): void {
    this.newTasks.controls.splice(taskControlPosition, 1);
  }

  get newTasks(): FormArray {
    return this.tasksCreationForm.get('tasks') as FormArray;
  }

  ngOnInit(): void {
    this.tasksCreationForm = new FormGroup({
      tasks: new FormArray([])
    });

    this.addTask();

    this.store
      .pipe(
        select(fromAdminSelectors.getAdminId),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(adminId => {
        this.adminId = adminId;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
