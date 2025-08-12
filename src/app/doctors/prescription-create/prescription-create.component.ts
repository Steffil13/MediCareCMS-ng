import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { ActivatedRoute } from '@angular/router';
import { DoctorService } from 'src/app/shared/service/doctor.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-prescription-create',
  templateUrl: './prescription-create.component.html',
  styleUrls: ['./prescription-create.component.scss']
})
export class PrescriptionCreateComponent implements OnInit {

  prescription = {
    appointmentId: 0,
    doctorId: 0, // from localStorage
    symptoms: '',
    diagnosis: '',
    notes: ''
  };

  // Medicines
  medicines = [{ medicineId: '', dosage: '', duration: '' }];
  availableMedicines: any[] = [];

  // Lab tests
  labTests = [{ labId: null as number | null }];
  availableLabTests: any[] = [];

  // Regex for dosage/duration: at least 1 letter, 1 number, allowed letters+numbers+spaces
  private dosageDurationRegex = /^(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9\s]+$/;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    // ✅ Get doctorId from localStorage
        this.prescription.doctorId = Number(localStorage.getItem('DOC_ID'));
    const storedDoctorId = localStorage.getItem('DOC_ID');
    if (storedDoctorId) {
      this.prescription.doctorId = parseInt(storedDoctorId, 10);
    }

    // ✅ Get appointmentId from route
    this.prescription.appointmentId = +this.route.snapshot.params['appointmentId'] || 0;

    // Load dropdown data
    this.loadAvailableMedicines();
    this.loadAvailableLabTests();
  }

  // 🔹 Load medicines for dropdown
  loadAvailableMedicines() {
    this.http.get<any[]>(`${environment.apiUrl}/PharmacistControllers/all-medicines`).subscribe({
      next: (res) => {
        console.log('Medicines loaded:', res);
        this.availableMedicines = res;
      },
      error: () => this.toastr.error('Failed to load medicines')
    });
  }

  // 🔹 Load lab tests for dropdown
  loadAvailableLabTests() {
    this.http.get<any[]>(`${environment.apiUrl}/LabTechnician/all-lab-tests`).subscribe({
      next: (res) => {
        console.log('Test loaded:', res);
        this.availableLabTests = res;
      },
      error: () => this.toastr.error('Failed to load lab tests')
    });
  }

  // 🔹 Add/remove rows
  addMedicineRow() {
    this.medicines.push({ medicineId: '', dosage: '', duration: '' });
  }

  removeMedicineRow(index: number) {
    if (this.medicines.length > 1) {
      this.medicines.splice(index, 1);
    }
  }

  addLabTestRow() {
    this.labTests.push({ labId: null });
  }

  removeLabTestRow(index: number) {
    if (this.labTests.length > 1) {
      this.labTests.splice(index, 1);
    }
  }

  // 🔹 Submit
  async submitConsultation() {
    // ✅ Validation for dosage and duration
    for (const [index, med] of this.medicines.entries()) {
      if (!this.dosageDurationRegex.test(med.dosage)) {
        this.toastr.warning(`Medicine #${index + 1}: Dosage must contain both letters and numbers`, 'Invalid Dosage');
        return;
      }
      if (!this.dosageDurationRegex.test(med.duration)) {
        this.toastr.warning(`Medicine #${index + 1}: Duration must contain both letters and numbers`, 'Invalid Duration');
        return;
      }
    }

    try {
      // Step 1️⃣ Create Prescription
      const prescriptionRes: any = await this.http
        .post(`${environment.apiUrl}/doctor/add-prescription`, this.prescription)
        .toPromise();

      const prescriptionId = prescriptionRes.data.prescriptionId;
      console.log("Prescription ID:", prescriptionId);

      // Step 2️⃣ Add Medicines
      for (const med of this.medicines) {
        console.log('Sending medicine data:', { prescriptionId, ...med });
        await this.http
          .post(`${environment.apiUrl}/doctor/add-medicine`, { prescriptionId, ...med })
          .toPromise();
      }

      // Step 3️⃣ Add Lab Tests
      for (const lab of this.labTests) {
        const labId = lab.labId ?? 0;
        const selectedLab = this.availableLabTests.find(t => t.labId === labId || t.testId === labId);

        console.log('Sending lab test data:', { prescriptionId, labId, labName: selectedLab?.labName });

        await this.http.post(`${environment.apiUrl}/doctor/add-labtest`, {
          prescriptionId,
          labId,
          labName: selectedLab?.labName || '',
          remarks: ''
        }).toPromise();
      }

      this.toastr.success('Consultation completed successfully!');
    } catch (err) {
      console.error('Consultation failed', err);
      this.toastr.error('Consultation failed');
    }
  }
  cancel(): void {
    this.router.navigate(['/appointments', this.prescription.doctorId])
  }
}
