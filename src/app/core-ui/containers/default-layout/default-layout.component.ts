import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromSharedSelectors from './../../../custom-ui/shared/store/shared.selectors';
import { Unsubscriber } from '../../../custom-ui/shared/services/unsubscriber.service';
import { takeUntil, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import * as fromSharedActions from './../../../custom-ui/shared/store/shared.actions';
import * as fromAuthActions from './../../../custom-ui/auth/store/auth.actions';
import * as fromAuthSelectors from './../../../custom-ui/auth/store/auth.selectors';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent extends Unsubscriber implements OnInit, OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  public element: HTMLElement;
  public isAppLoading: boolean;
  public isOnAuthFormPage: boolean;
  private changes: MutationObserver;

  constructor(
    private router: Router,
    private store: Store<fromApp.State>,
    private spinnerService: NgxSpinnerService,
    private cookieService: CookieService,
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

  public logUserOut(): void {
    this.store.dispatch(fromAuthActions.signOut());
  }

  public initializeApp(): void {
    const token = this.cookieService.get('Token');
    const expirationTime: number = Number(this.cookieService.get('ExpirationTime'));

    if (!token || Date.now() > expirationTime) {
      this.router.navigateByUrl('/sign-in');

      return;
    }

    this.store.dispatch(fromSharedActions.changeAppLoadingStatus({
      payload: true
    }));

    this.store.dispatch(fromSharedActions.startInitializingAppState({
      payload: { token, expirationTime }
    }));
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(fromSharedSelectors.getIsOnAuthFormPage),
        takeUntil(this.subscriptionController$$),
      )
      .subscribe(isOnAuthFormPage => {
        this.isOnAuthFormPage = isOnAuthFormPage;
      });

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

    this.store
      .pipe(
        select(fromAuthSelectors.getAuthStatus),
        take(1)
      )
      .subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.initializeApp();
        }
      });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
    super.ngOnDestroy();
  }
}
