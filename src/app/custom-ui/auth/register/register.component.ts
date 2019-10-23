import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  public registrationForm: FormGroup;

  constructor(private customValidatorsService: CustomValidatorsService) { }

  onRegistrationFormSubmit(): void {
    console.log(this.registrationForm);
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(5)]),
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
