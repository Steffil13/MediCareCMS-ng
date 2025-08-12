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
  successMessage = '';
  errorMessage = '';

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
        this.successMessage = 'Lab test added successfully! Redirecting...';
        this.errorMessage = '';
        this.labTestForm.reset();
        this.submitted = false;

        // Redirect after 3 seconds to medicines list (adjust route as needed)
        setTimeout(() => {
          this.router.navigate(['alllabtests']);
        }, 3000);

      },
      error: (err: any) => {
        this.errorMessage = 'Failed to add lab test.';
        this.successMessage = '';
        this.toastr.error(this.errorMessage);
        console.error(err);
      }
    });
  }
}
