import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import { Task } from '../../../shared/models/warehouse/task.model';
import * as fromApp from './../../../../store/app.reducers';
import * as fromWarehouseSelectors from './../../store/warehouse.selectors';
import * as fromAdminSelectors from './../../../admin/store/admin.selectors';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { SubordinateUser } from '../../../shared/models/users/subordinate-user.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends Unsubscriber implements OnInit, OnDestroy {
  public taskList: Task[];
  public subordinateList: SubordinateUser[];

  constructor(private store: Store<fromApp.State>) {
    super();
  }

  public getSubordinateName(subordinateId: string): string {
    return this.subordinateList.find((subordinate) => subordinate.userId === subordinateId).name;
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(fromWarehouseSelectors.getTasks),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(tasks => {
        this.taskList = tasks;
      });

    this.store
      .pipe(
        select(fromAdminSelectors.getSubordinates),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(subordinates => {
        this.subordinateList = subordinates;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
