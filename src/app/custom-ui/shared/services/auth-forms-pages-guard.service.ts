import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as fromAuthSelectors from '../../auth/store/auth.selectors';
import { map, take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

export class AuthFormsPagesGuard implements CanActivate {
    constructor(
        private store: Store<fromApp.State>,
        private router: Router,
        private cookieService: CookieService
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
                        return this.declinePageLoading();
                    }

                    const token: string = this.cookieService.get('Token');
                    const expirationTime: number = Number(this.cookieService.get('ExpirationTime'));

                    if (token && Date.now() < expirationTime) {
                        return this.declinePageLoading();
                    }

                    this.cookieService.delete('Token');
                    this.cookieService.delete('ExpirationTime');

                    return true;
                }),
                take(1)
            );
    }

    private declinePageLoading(): boolean {
        this.router.navigateByUrl('/dashboard');

        return false;
    }
}
