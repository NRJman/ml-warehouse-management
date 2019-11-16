import {
    ValidationErrors,
    ValidatorFn,
    AbstractControl,
    AsyncValidatorFn,
    FormGroup
} from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomValidatorsService {
    public passwordsEqualityValidator(controlToBeEqualWith: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return (controlToBeEqualWith.value !== control.value) ? { passwordsEquality: true } : null;
        };
    }

    public areaUniquenessValidator(allAreaControls: AbstractControl[]): AsyncValidatorFn {
        return (): Observable<ValidationErrors | null> => {
            return timer(400).pipe(
                map(() => {
                    const allAreaControlValues = allAreaControls.map(
                        control => control.value
                    );
                    const numberOfUniqueValues = new Set(allAreaControlValues).size;

                    return (allAreaControlValues.length !== numberOfUniqueValues) ? { areaUniqueness: true } : null;
                })
            );
        };
    }

    public productDescriptionUniquenessValidator(allProducts: FormGroup[]): AsyncValidatorFn {
        return (): Observable<ValidationErrors | null> => {
            return timer(400).pipe(
                map(() => {
                    const allProductDescriptions = allProducts.map(
                        productFormGroup => productFormGroup.value.description
                    );
                    const numberOfUniqueValues = new Set(allProductDescriptions).size;

                    return (allProductDescriptions.length !== numberOfUniqueValues) ? { productDescriptionUniqueness: true } : null;
                })
            );
        };
    }
}
