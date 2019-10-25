import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAuthActions from './../../auth/store/auth.actions';
import { RegistrationData } from '../../shared/models/registration-data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  public registrationForm: FormGroup;

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) { }

  onRegistrationFormSubmit(): void {
    const registrationFormValue = this.registrationForm.value;

    this.store.dispatch(fromAuthActions.startSignUp({
      name: registrationFormValue.name,
      phone: registrationFormValue.phone,
      email: registrationFormValue.email,
      password: registrationFormValue.password,
      isAdmin: true
    } as RegistrationData));
  }

  ngOnInit(): void {
    this.initializeRegistrationForm();
  }

  private initializeRegistrationForm(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      phone: new FormControl(null, [Validators.required, Validators.pattern('^\\d{9}$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      repeatPassword: new FormControl(null)
    });

    this.registrationForm.get('repeatPassword').setValidators([
      Validators.required,
      this.customValidatorsService.passwordsEqualityValidator(this.registrationForm.get('password'))
    ]);
  }
}
