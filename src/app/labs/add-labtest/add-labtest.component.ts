import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

@Component({
  selector: 'app-add-labtest',
  templateUrl: './add-labtest.component.html',
})
export class AddLabtestComponent {
  labTestForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private labService: LabTechnicianService) {
    this.labTestForm = this.fb.group({
      LabName: ['', Validators.required],
      normalrange: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.labTestForm.invalid) {
      return;
    }

    const labTest = this.labTestForm.value;

    this.labService.addLabTest(labTest).subscribe({
      next: () => {
        console.log('Lab test added successfully', labTest);
        this.successMessage = 'Lab test added successfully!';
        this.errorMessage = '';
        this.labTestForm.reset();
        this.submitted = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to add lab test.';
        this.successMessage = '';
        console.error(err);
      }
    });
  }
}


