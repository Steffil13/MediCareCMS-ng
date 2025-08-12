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
  patient: Patient = new Patient();
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Validation flags
  dobFutureError = false;
  emergencySameError = false;
  phonePatternError = false;
  emergencyPatternError = false;

  submitted = false; // track form submission to show errors

  constructor(
    private route: ActivatedRoute,
    private patientService: ReceptionistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.patientService.getPatientById(id).subscribe({
        next: (res) => {
          this.patient = {
            ...res,
            dob: res.dob instanceof Date
              ? res.dob.toISOString().substring(0, 10)
              : (typeof res.dob === 'string' ? (res.dob as string).split('T')[0] : '')
          };
        },
        error: (err) => {
          console.error('Error loading patient', err);
          this.errorMessage = '❌ Failed to load patient details.';
        }
      });
    }
  }

  // Validate DOB is not in the future
  checkDOB() {
    if (!this.patient.dob) {
      this.dobFutureError = false;
      return;
    }
    const today = new Date();
    const dobDate = new Date(this.patient.dob);
    this.dobFutureError = dobDate > today;
  }

  // Validate phone pattern
  validatePhone() {
    const phoneRegex = /^[6-9][0-9]{9}$/;
    this.phonePatternError = !phoneRegex.test(this.patient.contact || '');
    this.checkEmergencyVsPhone();
  }

  // Validate emergency phone pattern
  validateEmergency() {
    const phoneRegex = /^[6-9][0-9]{9}$/;
    this.emergencyPatternError = !phoneRegex.test(this.patient.emergencyNumber || '');
    this.checkEmergencyVsPhone();
  }

  // Emergency number must be different from phone number
  checkEmergencyVsPhone() {
    this.emergencySameError = this.patient.contact && this.patient.emergencyNumber
      ? this.patient.contact === this.patient.emergencyNumber
      : false;
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.submitted = true; // Show validation errors now

    this.checkDOB();
    this.validatePhone();
    this.validateEmergency();

    if (
      this.dobFutureError ||
      this.emergencySameError ||
      this.phonePatternError ||
      this.emergencyPatternError
    ) {
      this.errorMessage = 'Please fix errors in the form before submitting.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.patientService.editPatient(this.patient, this.patient.patientId).subscribe({
      next: (res) => {
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
}
