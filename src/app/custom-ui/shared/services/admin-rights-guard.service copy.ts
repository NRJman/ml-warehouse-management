import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAuthSelectors from './../../auth/store/auth.selectors';
import * as fromSharedActions from './../store/shared.actions';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export class AdminRightsGuard implements CanActivate {
    constructor(
        private store: Store<fromApp.State>
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.store
            .pipe(
                select(fromAuthSelectors.getAdminStatus),
                map(isAdmin => {
                    if (!isAdmin) { // is null here. check this point later.
                        this.store.dispatch(fromSharedActions.navigate({ payload: '/available-tasks' }));

                        return false;
                    }

                    return true;
                }),
                take(1)
            );
    }
}
