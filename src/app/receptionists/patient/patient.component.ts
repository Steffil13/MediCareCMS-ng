import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { ReceptionistService } from 'src/app/shared/Service/receptionist.service';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  patients: Patient[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(
    private receptionistService: ReceptionistService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }


  // ✅ Load all patients (you may need a real API method for this)
  getAllPatients(): void {
    this.loading = true;
    this.errorMessage = '';

    // If API doesn't have getAllPatients, replace with your real call
    this.receptionistService.getAllPatients()
      .subscribe({
        next: (data) => {
          console.log("data", data);
          
          this.patients = data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load patients';
          console.error(err);
          this.loading = false;
        }
      });
  }

  loadPatients(): void {
    this.loading = true;
    this.errorMessage = '';
    // You don’t seem to have a `getAllPatients` method in the service yet,
    // so you could either add it to your API, or load them based on criteria
    this.receptionistService.searchPatientByPhone('') // adjust this call
      .subscribe({
        next: (patient) => {
          // If your API returns a single patient for search, wrap it in an array
          this.patients = patient ? [patient] : [];
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load patients';
          console.error(err);
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.loadPatients();
      return;
    }
    this.receptionistService.searchPatientByPhone(this.searchTerm)
      .subscribe({
        next: (patient) => {
          this.patients = patient ? [patient] : [];
        },
        error: (err) => {
          this.errorMessage = 'No patient found';
          this.patients = [];
          console.error(err);
        }
      });
  }
  // ✅ Calculate age from date of birth
  calculateAge(dob: string | Date): number {
  if (!dob) return 0;

  let birthDate: Date;

  if (typeof dob === 'string') {
    birthDate = new Date(dob);
  } else {
    birthDate = dob;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

  onAddPatient(): void {
  // Example navigation to add-patient form
  this.router.navigate(['add'], { relativeTo: this.route });
;
}

onEditPatient(patient: Patient): void {
  // Navigate to edit form with patient ID
  this.router.navigate([`edit/${patient.patientId}`],{ relativeTo: this.route } );
}

}
