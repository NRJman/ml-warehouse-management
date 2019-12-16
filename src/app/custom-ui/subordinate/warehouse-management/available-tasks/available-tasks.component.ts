import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import * as fromApp from './../../../../store/app.reducers';
import * as fromWarehouseSelectors from './../../../warehouse/store/warehouse.selectors';
import * as fromWarehouseActions from './../../../warehouse/store/warehouse.actions';
import * as fromSubordinateSelectors from './../../store/subordinate.selectors';
import { Task } from '../../../shared/models/warehouse/task.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-available-tasks',
  templateUrl: './available-tasks.component.html',
  styleUrls: ['./available-tasks.component.scss']
})
export class AvailableTasksComponent extends Unsubscriber implements OnInit, OnDestroy {
  public taskList: Task[];
  public warehouseId: string;
  public subordinateId: string;
  
  constructor(private store: Store<fromApp.State>) {
    super();
  }

  public onProgressCheckboxChange($event: Event, taskIndex: number): void {
    const isInProgress: boolean = (event.target as HTMLInputElement).checked;

    this.store.dispatch(
      fromWarehouseActions.startUpdatingTaskAssignee({
        payload: {
          userId: isInProgress ? this.subordinateId : null,
          taskId: this.taskList[taskIndex]._id,
          warehouseId: this.warehouseId
        }
      })
    );
  }

  public get isItAllowedToUpdateTasks(): boolean {
    return Boolean(this.warehouseId && this.subordinateId);
  }

  ngOnInit() {
    this.store
      .pipe(
        select(fromWarehouseSelectors.getWarehouseState),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(({ warehouseId, tasks }) => {
        this.taskList = tasks;
        this.warehouseId = warehouseId;
      });

    this.store
      .pipe(
        select(fromSubordinateSelectors.getSubordinateId),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(userId => {
        this.subordinateId = userId;
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
