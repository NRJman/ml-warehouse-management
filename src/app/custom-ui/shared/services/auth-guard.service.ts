import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const doesTokenExist: boolean = this.cookieService.check('Token');

    if (!doesTokenExist) {
      this.declinePageLoading();
    }

    const expirationTime: number = Number(this.cookieService.get('ExpirationTime'));

    if (Date.now() > expirationTime) {
      this.cookieService.delete('Token');
      this.cookieService.delete('ExpirationTime');

      this.declinePageLoading();
    }

    return true;
  }

  private declinePageLoading(): Observable<boolean> | Promise<boolean> | boolean {
    this.router.navigate(['/login']);

    return false;
  }
}
