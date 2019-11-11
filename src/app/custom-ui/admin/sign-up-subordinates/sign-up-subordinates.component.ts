import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';

@Component({
  selector: 'app-sign-up-subordinates',
  templateUrl: './sign-up-subordinates.component.html',
  styleUrls: ['./sign-up-subordinates.component.scss']
})
export class SignUpSubordinatesComponent implements OnInit {
  public signUpSubordinatesForm: FormGroup;

  constructor(private customValidatorsService: CustomValidatorsService) { }

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

  get subordinates(): FormArray {
    return this.signUpSubordinatesForm.get('subordinates') as FormArray;
  }

  ngOnInit(): void {
    this.signUpSubordinatesForm = new FormGroup({
      subordinates: new FormArray([])
    });

    this.addSubordinate();
  }

}
