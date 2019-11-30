import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { SubordinateUser } from '../../../shared/models/users/subordinate-user.model';
import * as fromApp from './../../../../store/app.reducers';
import * as fromAdminSelectors from './../../store/admin.selectors';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-subordinate-list',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss']
})
export class SubordinateListComponent extends Unsubscriber implements OnInit, OnDestroy {
  public subordinateList: SubordinateUser[];
  public randomImageNumberList: number[];

  constructor(private store: Store<fromApp.State>) {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(fromAdminSelectors.getSubordinates),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(subordinates => {
        const [minRand, maxRand]: [number, number] = [1, 10];

        this.subordinateList = subordinates;
        this.randomImageNumberList = subordinates.map(() =>
          Math.floor(Math.random() * (maxRand - minRand)) + minRand
        );
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
