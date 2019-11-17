import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import { getAccessToken } from '../../auth/store/auth.selectors';
import { take, mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private store: Store<fromApp.State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.url.match(/init|ussouthcentral.services.azureml.net/i)) {
            return next.handle(req);
        }

        return this.store.select(getAccessToken)
            .pipe(
                take(1),
                mergeMap((token: string) => {
                    const modifiedRequest = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${token}`)
                    });

                    return next.handle(modifiedRequest);
                })
            );
    }
}
