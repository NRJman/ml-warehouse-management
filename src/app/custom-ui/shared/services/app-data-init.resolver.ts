import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppDataInitType } from '../models/app/app-data-init-type.model';
import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { INIT_API_SERVER_URL_TOKEN } from '../../../app.config';

@Injectable()
export class AppDataInitResolver implements Resolve<AppDataInitType> {
    constructor(
        private http: HttpClient,
        private cookieService: CookieService,
        @Inject(INIT_API_SERVER_URL_TOKEN) private initApiServerUrl: string
    ) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<AppDataInitType> | Promise<AppDataInitType> | AppDataInitType {
        this.http.get(this.initApiServerUrl, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.cookieService.get('Token')}`
            })
        }).subscribe(console.log);

        return null;
    }
}
