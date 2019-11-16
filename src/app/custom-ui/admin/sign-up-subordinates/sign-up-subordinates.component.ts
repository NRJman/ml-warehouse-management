import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import * as fromApp from './../../../store/app.reducers';
import * as fromAdmin from './../store/admin.reducer';
import * as fromAdminActions from './../store/admin.actions';
import * as fromAdminSelectors from './../store/admin.selectors';
import { Store, select } from '@ngrx/store';
import { Unsubscriber } from '../../shared/services/unsubscriber.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up-subordinates',
  templateUrl: './sign-up-subordinates.component.html',
  styleUrls: ['./sign-up-subordinates.component.scss']
})
export class SignUpSubordinatesComponent extends Unsubscriber implements OnInit, OnDestroy {
  public signUpSubordinatesForm: FormGroup;
  public adminState: fromAdmin.State;

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) {
    super();
  }

  public onSignUpSubordinatesFormSubmit(): void {
    const registrationDataList = this.subordinates.controls.map(
      ({ value: { name, phone, email, password } }) => ({ name, phone, email, password })
    );

    this.store.dispatch(fromAdminActions.startSigningUpSubordinates({
      payload: {
        registrationDataList,
        adminId: this.adminState.adminId,
        warehouseId: this.adminState.warehouseId
      }
    }));
  }

  public addSubordinate(): void {
    const newSubordinate: FormGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{9}$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      repeatPassword: new FormControl(null)
    });

    newSubordinate.get('repeatPassword').setValidators([
      Validators.required,
      this.customValidatorsService.passwordsEqualityValidator(newSubordinate.get('password'))
    ]);

    this.subordinates.push(newSubordinate);
  }

  public deleteSubordinate(subordinateControlPosition: number): void {
    this.subordinates.controls.splice(subordinateControlPosition, 1);
  }

  public get subordinates(): FormArray {
    return this.signUpSubordinatesForm.get('subordinates') as FormArray;
  }

  ngOnInit(): void {
    this.signUpSubordinatesForm = new FormGroup({
      subordinates: new FormArray([])
    });

    this.addSubordinate();

    this.store
      .pipe(
        select(fromAdminSelectors.getAdminState),
        takeUntil(this.subscriptionController$$)
      )
      .subscribe((adminState: fromAdmin.State) => {
        this.adminState = adminState;
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
