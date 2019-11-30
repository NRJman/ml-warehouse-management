import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../../store/app.reducers';
import * as fromAdminSelectors from './../../../admin/store/admin.selectors';
import * as fromWarehouseSelectors from './../../store/warehouse.selectors';
import * as fromWarehouseActions from './../../store/warehouse.actions';
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
  public warehouseId: string;

  constructor(
    private store: Store<fromApp.State>
  ) {
    super();
  }

  public onTasksCreationFormSubmit(): void {
    this.store.dispatch(
      fromWarehouseActions.startCreatingTasks({
        payload: {
          warehouseId: this.warehouseId,
          tasks: this.newTasks.controls.map(taskControl => taskControl.value)
        }
      })
    );
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

    this.store
      .pipe(
        select(fromWarehouseSelectors.getWarehouseId),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(warehouseId => {
        this.warehouseId = warehouseId;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
