import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAdminSelectors from './../../admin/store/admin.selectors';
import { take, mergeMap } from 'rxjs/operators';

@Injectable()
export class AdminRightsInterceptor implements HttpInterceptor {
    constructor(private store: Store<fromApp.State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select(fromAdminSelectors.getUserId)
            .pipe(
                take(1),
                mergeMap((userId: string) => {
                    const modifiedRequest = req.clone({
                        headers: req.headers.set('Access-Rights-Id', `Access rights id ${userId}`)
                    });

                    return next.handle(modifiedRequest);
                })
            );
    }
}
