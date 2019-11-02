import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from './../../../store/app.reducers';
import * as fromAuthActions from './../store/auth.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  public signInForm: FormGroup;

  constructor(private store: Store<fromApp.State>) { }

  onSignInFormSubmit(): void {
    const signInFormValue = this.signInForm.value;

    this.store.dispatch(fromAuthActions.startSigningIn({
      payload: {
        email: signInFormValue.email,
        password: signInFormValue.password
      }
    }));
  }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
  }
}
