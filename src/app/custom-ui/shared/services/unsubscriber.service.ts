import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export class Unsubscriber implements OnDestroy {
    protected subscriptionController$$: Subject<null>;

    ngOnDestroy(): void {
        this.subscriptionController$$.next(null);
        this.subscriptionController$$.complete();
    }
}
