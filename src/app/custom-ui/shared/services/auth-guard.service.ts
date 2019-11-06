import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../../app/store/app.reducers';
import * as fromSharedActions from './../../shared/store/shared.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private store: Store<fromApp.State>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.cookieService.get('Token');

    if (!token) {
      this.declinePageLoading();
    }

    const expirationTime: number = Number(this.cookieService.get('ExpirationTime'));

    if (Date.now() > expirationTime) {
      this.cleanCookies();
      this.declinePageLoading();
    }

    if (!this.isItAuthFormPage(route.url)) {
      this.store.dispatch(fromSharedActions.startInitializingAppState({
        payload: { token, expirationTime }
      }));
    }

    return true;
  }

  private declinePageLoading(): Observable<boolean> | Promise<boolean> | boolean {
    this.router.navigate(['/login']);

    return false;
  }

  private cleanCookies(): void {
    this.cookieService.delete('Token');
    this.cookieService.delete('ExpirationTime');
  }

  private isItAuthFormPage(urlSegments: UrlSegment[]): boolean {
    return urlSegments.some(urlSegment => Boolean(urlSegment.path.match(/login|register/g)));
  }
}
