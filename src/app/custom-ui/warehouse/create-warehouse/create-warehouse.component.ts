import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CustomValidatorsService } from '../../shared/services/custom-validators.service';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent implements OnInit {
  public warehouseCreationForm: FormGroup;

  constructor(private сustomValidatorsService: CustomValidatorsService) { }

  public addArea(): void {
    const formControlsToCheckUniqueness = [...this.warehouseAreas.controls];

    this.warehouseAreas.push(new FormControl(
      null,
      [
        Validators.required,
        Validators.minLength(3),
      ],
      this.сustomValidatorsService.areaUniquenessValidator(formControlsToCheckUniqueness)
    ));
  }

  public deleteArea(areaControlPosition: number): void {
    this.warehouseAreas.controls.splice(areaControlPosition, 1);
  }

  get warehouseAreas(): FormArray {
    return this.warehouseCreationForm.get('areas') as FormArray;
  }

  ngOnInit() {
    this.warehouseCreationForm = new FormGroup({
      areas: new FormArray([])
    });

    this.addArea();
  }

}
