import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import * as fromApp from '../../../../store/app.reducers';
import * as fromAdminSelectors from '../../../admin/store/admin.selectors';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/services/unsubscriber.service';
import { SubordinateUser } from '../../../shared/models/users/subordinate-user.model';

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
        const [minRand, maxRand]: [number, number] = [1, 9];

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
