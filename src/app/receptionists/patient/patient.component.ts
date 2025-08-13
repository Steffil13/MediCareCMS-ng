import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { SharedModule } from 'src/app/shared/nav/shared/shared.module';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';
import { NgxPaginationModule } from 'ngx-pagination'; // ✅ Added for paginate pipe

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule, NgxPaginationModule], // ✅ Added NgxPaginationModule
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  patients: Patient[] = [];
  allPatients: Patient[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';
  page = 1; // ✅ Needed for pagination

  constructor(
    private receptionistService: ReceptionistService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAllPatients();
  }

  getAllPatients(): void {
    this.loading = true;
    this.errorMessage = '';
    this.receptionistService.getAllPatients().subscribe({
      next: (data) => {
        this.allPatients = data || [];
        this.patients = [...this.allPatients];
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
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.patients = [...this.allPatients];
      return;
    }
    this.patients = this.allPatients.filter((p) =>
      p.contact?.toLowerCase().includes(term) ||
      p.registerNumber?.toLowerCase().includes(term) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(term)
    );
    this.errorMessage = this.patients.length ? '' : 'No patients found';
  }

  calculateAge(dob: string | Date): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onAddPatient(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onEditPatient(patient: Patient): void {
    this.router.navigate([`edit/${patient.patientId}`], { relativeTo: this.route });
  }
  goBack(): void {
    this.location.back();
  }
}
