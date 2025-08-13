import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-labtest',
  templateUrl: './add-labtest.component.html',
  styleUrls: ['./add-labtest.component.scss']
})
export class AddLabtestComponent {
  labTestForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private labService: LabTechnicianService,
    private toastr: ToastrService,
    private router: Router
  ) {
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
        this.toastr.success('Lab test added successfully!');
        this.labTestForm.reset();
        this.submitted = false;
        this.router.navigate(['alllabtests']);
      },
      error: (err: any) => {
        this.toastr.error('Failed to add lab test.');
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['labdashboard']);
  }
}
