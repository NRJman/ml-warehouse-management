import {
    ValidationErrors,
    ValidatorFn,
    AbstractControl,
    AsyncValidatorFn
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { mapTo, map } from 'rxjs/operators';

export class CustomValidatorsService {
    public passwordsEqualityValidator(controlToBeEqualWith: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return (controlToBeEqualWith.value !== control.value) ? { passwordsEquality: true } : null;
        };
    }

    public areaUniquenessValidator(otherAreas: AbstractControl[]): AsyncValidatorFn {
        return ({ value: currentAreaValue }: AbstractControl): Observable<ValidationErrors | null> => {
            return timer(400).pipe(
                map(() => {
                    const isAreaUnique: boolean = otherAreas.every(
                        ({ value }) => currentAreaValue !== value
                    );

                    return !isAreaUnique ? { areaUniqueness: true } : null;
                })
            );
        };
    }
}
