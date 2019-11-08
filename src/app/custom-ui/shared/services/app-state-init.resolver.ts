import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

@Injectable()
export class AppStateResolver implements Resolve<boolean> {
    constructor(private actionsStream$: ActionsSubject) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        return true;
    }
}
