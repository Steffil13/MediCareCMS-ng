import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {
  patient: Patient = {} as Patient;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  submitted = false;

  dobFutureError = false;
  phonePatternError = false;
  emergencyPatternError = false;
  emergencySameError = false;

  constructor(
    private route: ActivatedRoute,
    private patientService: ReceptionistService,
    private router: Router
  ) {}

  ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        if (data.dob) {
          // Convert to yyyy-MM-dd for date input
          data.dob = new Date(data.dob).toISOString().split('T')[0];
        }
        this.patient = data;
      },
      error: (err) => console.error(err)
    });
  }
}


  checkDOB() {
    if (this.patient.dob) {
      const today = new Date();
      const enteredDate = new Date(this.patient.dob);
      this.dobFutureError = enteredDate > today;
    }
  }

  validatePhone() {
    const phoneRegex = /^[0-9]{10}$/;
    this.phonePatternError = !phoneRegex.test(this.patient.contact || '');
  }

  validateEmergency() {
    const phoneRegex = /^[0-9]{10}$/;
    this.emergencyPatternError = !phoneRegex.test(this.patient.emergencyNumber || '');
    this.emergencySameError = this.patient.contact === this.patient.emergencyNumber;
  }

  onSubmit(form: any) {
    this.submitted = true;

    // Run validations
    this.checkDOB();
    this.validatePhone();
    this.validateEmergency();

    if (!form.valid || this.dobFutureError || this.emergencySameError || this.phonePatternError || this.emergencyPatternError) {
      this.errorMessage = 'Please fix the errors before submitting.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.patientService.editPatient(this.patient, this.patient.patientId).subscribe({
      next: () => {
        this.successMessage = '✅ Patient updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/auth/receptionist/patients']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Failed to update patient. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/receptionist/patients']);
  }
}
