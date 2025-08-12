import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {
  @ViewChild('patientForm') patientForm!: NgForm;  // <-- Capture form reference

  patient: Patient = new Patient();
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  dobFutureError = false;
  emergencySameError = false;
  phonePatternError = false;
  emergencyPatternError = false;

  submitted = false;

  constructor(
    private patientService: ReceptionistService,
    private router: Router
  ) {}

  generatePatientRegNumber(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return 'PAT' + randomDigits;
  }

  checkDOB() {
    if (!this.patient.dob) {
      this.dobFutureError = false;
      return;
    }
    const today = new Date();
    const dobDate = new Date(this.patient.dob);
    this.dobFutureError = dobDate > today;
  }

  validatePhone() {
    const phoneRegex = /^[6-9][0-9]{9}$/;
    this.phonePatternError = !phoneRegex.test(this.patient.contact || '');
    this.checkEmergencyVsPhone();
  }

  validateEmergency() {
    const phoneRegex = /^[6-9][0-9]{9}$/;
    this.emergencyPatternError = !phoneRegex.test(this.patient.emergencyNumber || '');
    this.checkEmergencyVsPhone();
  }

  checkEmergencyVsPhone() {
    this.emergencySameError = this.patient.contact && this.patient.emergencyNumber
      ? this.patient.contact === this.patient.emergencyNumber
      : false;
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.submitted = true;

    // Mark all controls as touched to show validation errors immediately
    this.patientForm.form.markAllAsTouched();

    this.checkDOB();
    this.validatePhone();
    this.validateEmergency();

    // Also check Angular form validity to catch required/minlength/pattern errors
    if (this.patientForm.invalid || this.dobFutureError || this.emergencySameError || this.phonePatternError || this.emergencyPatternError) {
      this.errorMessage = 'Please fix the errors in the form before submitting.';
      return;
    }

    this.patient.registerNumber = this.generatePatientRegNumber();
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.patientService.addPatient(this.patient).subscribe({
      next: () => {
        this.successMessage = '✅ Patient added successfully!';
        setTimeout(() => {
          this.router.navigate(['/auth/receptionist/patients']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Failed to add patient. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/receptionist/patients']);
  }
}
