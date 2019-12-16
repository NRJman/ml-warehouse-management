import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromWarehouseActions from './../../warehouse/store/warehouse.actions';
import { Task } from '../models/warehouse/task.model';
import { AssigneeUpdateResult } from '../models/warehouse/assignee-update-result.model';

@Injectable()
export class SocketService {
    private readonly subordinateSocketEventNamesMap = {
        tasksWereAdded: 'tasks were added'
    };

    private readonly adminSocketEventNamesMap = {
        taskWasAssignedToSomebody: 'task was assigned to somebody'
    };

    constructor(
        private socket: Socket,
        private store: Store<fromApp.State>
    ) { }

    public subscribeToAdminSocketEvents(): void {
        this.socket
            .fromEvent(this.adminSocketEventNamesMap.taskWasAssignedToSomebody)
            .subscribe((result: AssigneeUpdateResult) => {
                this.store.dispatch(fromWarehouseActions.storeTaskAssigneeUpdateResult({ payload: result }));
            });
        }
        
        public subscribeToSubordinateSocketEvents(): void {
            this.socket
            .fromEvent(this.subordinateSocketEventNamesMap.tasksWereAdded)
            .subscribe((taskList: Task[]) => {
                this.store.dispatch(fromWarehouseActions.storeTasksUpdateResult({ payload: taskList }));
            });
    }

    public deleteAdminSocketSubscriptions(): void {
        for (let key in this.adminSocketEventNamesMap) {
            this.socket.removeAllListeners(this.adminSocketEventNamesMap[key]);
        }
    }

    public deleteSubordinateSocketSubscriptions(): void {
        for (let key in this.subordinateSocketEventNamesMap) {
            this.socket.removeAllListeners(this.subordinateSocketEventNamesMap[key]);
        }
    }
}