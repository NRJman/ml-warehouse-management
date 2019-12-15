import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import * as fromApp from './../../../../store/app.reducers';
import * as fromWarehouseSelectors from './../../../warehouse/store/warehouse.selectors';
import { Task } from '../../../shared/models/warehouse/task.model';
import { takeUntil, map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-available-tasks',
  templateUrl: './available-tasks.component.html',
  styleUrls: ['./available-tasks.component.scss']
})
export class AvailableTasksComponent extends Unsubscriber implements OnInit, OnDestroy {
  public taskList: Task[];
  
  constructor(private store: Store<fromApp.State>, private socket: Socket) {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(fromWarehouseSelectors.getTasks),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(tasks => {
        this.taskList = tasks;
      });

    this.socket
      .fromEvent('task was added')
      .subscribe((data) => {
        console.log(data);
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
