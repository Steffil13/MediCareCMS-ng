import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';

@Component({
  selector: 'app-add-patient',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss']
})
export class AddPatientComponent {
  patient: Patient = new Patient();
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private patientService: ReceptionistService,
    private router: Router
  ) { }

  generatePatientRegNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // generates a random 4-digit number (1000-9999)
  return 'PAT' + randomDigits;
}
  onSubmit() {
    if (this.isSubmitting) return;

    this.patient.registerNumber = this.generatePatientRegNumber();
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.patientService.addPatient(this.patient).subscribe({
      next: (res) => {
        this.successMessage = '✅ Patient added successfully!';
        setTimeout(() => {
          this.router.navigate(['/auth/receptionist/patients']); // redirect to patient list
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Failed to add patient. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
