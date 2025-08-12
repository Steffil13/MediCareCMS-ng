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

  constructor(
    private route: ActivatedRoute,
    private patientService: ReceptionistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      console.log("id", id);

      this.patientService.getPatientById(id).subscribe({

        next: (res) => {
          console.log(res);

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

  onSubmit() {
    if (this.isSubmitting) return;

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
