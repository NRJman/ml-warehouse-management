import {
    ValidationErrors,
    ValidatorFn,
    AbstractControl
} from '@angular/forms';

export class CustomValidatorsService {
    public passwordsEqualityValidator(controlToBeEqualWith: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return (controlToBeEqualWith.value !== control.value) ? { passwordsEquality: true } : null;
        };
    }
}
