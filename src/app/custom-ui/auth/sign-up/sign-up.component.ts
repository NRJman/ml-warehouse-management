import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as fromAuthActions from '../store/auth.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;

  constructor(
    private customValidatorsService: CustomValidatorsService,
    private store: Store<fromApp.State>
  ) { }

  onSignUpFormSubmit(): void {
    const signUpFormValue = this.signUpForm.value;

    this.store.dispatch(
      fromAuthActions.startSigningUpAdmin({
        payload: {
          registrationData: {
            name: signUpFormValue.name,
            phone: signUpFormValue.phone,
            email: signUpFormValue.email,
            password: signUpFormValue.password
          }
        }
      })
    );
  }

  ngOnInit(): void {
    this.initializeSignUpForm();
  }

  private initializeSignUpForm(): void {
    this.signUpForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      phone: new FormControl(null, [Validators.required, Validators.minLength(9)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      repeatPassword: new FormControl(null)
    });

    this.signUpForm.get('repeatPassword').setValidators([
      Validators.required,
      this.customValidatorsService.passwordsEqualityValidator(this.signUpForm.get('password'))
    ]);
  }
}
