import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Store, select } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as fromAuthSelectors from '../../auth/store/auth.selectors';
import { take, map } from 'rxjs/operators';

@Injectable()
export class GenericPagesGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private store: Store<fromApp.State>
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.store
      .pipe(
        select(fromAuthSelectors.getAuthStatus),
        map(isAuthenticated => {
          if (isAuthenticated) {
            return true;
          }

          const token: string = this.cookieService.get('Token');
          const expirationTime: number = Number(this.cookieService.get('ExpirationTime'));

          if (token && Date.now() < expirationTime) {
            return true;
          }

          this.router.navigateByUrl('/login');

          return false;
        }),
        take(1)
      );
  }
}
