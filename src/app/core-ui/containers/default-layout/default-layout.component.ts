import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromSharedSelectors from './../../../custom-ui/shared/store/shared.selectors';
import { Observable } from 'rxjs';
import { Unsubscriber } from '../../../custom-ui/shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent extends Unsubscriber implements OnInit, OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  public element: HTMLElement;
  public isAppLoading: boolean;
  private changes: MutationObserver;

  constructor(
    private router: Router,
    private store: Store<fromApp.State>,
    private spinnerService: NgxSpinnerService,
    @Inject(DOCUMENT) public _document?: any
  ) {
    super();

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });

    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  logUserOut(): void {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(fromSharedSelectors.getIsAppLoading),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(isAppLoading => {
        this.isAppLoading = isAppLoading;

        if (isAppLoading) {
          this.spinnerService.show();

          return;
        }

        this.spinnerService.hide();
      });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
    super.ngOnDestroy();
  }
}
