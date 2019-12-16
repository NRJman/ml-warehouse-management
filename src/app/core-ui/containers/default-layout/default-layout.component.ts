import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Unsubscriber } from '../../../custom-ui/shared/services/unsubscriber.service';
import { takeUntil, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import * as fromApp from './../../../store/app.reducers';
import * as fromSharedSelectors from './../../../custom-ui/shared/store/shared.selectors';
import * as fromSharedActions from './../../../custom-ui/shared/store/shared.actions';
import * as fromAuthActions from './../../../custom-ui/auth/store/auth.actions';
import * as fromAuthSelectors from './../../../custom-ui/auth/store/auth.selectors';
import * as fromSubordinateActions from './../../../custom-ui/subordinate/store/subordinate.actions';
import { CookieService } from 'ngx-cookie-service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductActionsModalComponent } from '../../../custom-ui/subordinate/warehouse-management/product-actions-modal/product-actions-modal.component';
import { SocketService } from '../../../custom-ui/shared/services/socket.service';

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
  public bsModalRef: BsModalRef;
  private changes: MutationObserver;
  private isAdmin: boolean;

  constructor(
    private router: Router,
    private store: Store<fromApp.State>,
    private spinnerService: NgxSpinnerService,
    private cookieService: CookieService,
    private modalService: BsModalService,
    private socketService: SocketService,
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

  public openProductActionsModal(): void {
    this.bsModalRef = this.modalService.show(ProductActionsModalComponent, {class: 'modal-lg'});
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

    this.store.dispatch(
      fromSharedActions.changeAppLoadingStatus({
        payload: true
      })
    );

    this.store.dispatch(
      fromSharedActions.prepareForStartingAppStateInitialization({
        payload: { token, expirationTime }
      })
    );
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

    this.store
      .pipe(
        select(fromAuthSelectors.getAdminStatus),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      });

    this.modalService.onHide
      .pipe(
        takeUntil(this.subscriptionController$$)
      )
      .subscribe(() => {
        if (this.bsModalRef.content instanceof ProductActionsModalComponent) {
          this.store.dispatch(fromSubordinateActions.cleanSpecificProductInfo())
        }
      });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
    super.ngOnDestroy();

    if (this.isAdmin) {
      this.socketService.deleteAdminSocketSubscriptions();

      return;
    }

    this.socketService.deleteSubordinateSocketSubscriptions();
  }
}
