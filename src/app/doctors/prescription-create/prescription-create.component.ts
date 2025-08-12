import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from 'src/app/shared/service/doctor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-prescription-create',
  templateUrl: './prescription-create.component.html',
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
  labTests = [{ labId: null as number | null}];
  availableLabTests: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // ✅ Get doctorId from localStorage
    const storedDoctorId = localStorage.getItem('doctorId');
    if (storedDoctorId) {
      this.prescription.doctorId = parseInt(storedDoctorId, 10);
    }

    // ✅ Get appointmentId from route
    this.prescription.appointmentId = +this.route.snapshot.params['appointmentId'] || 0;

    // Load dropdown data
    console.log("lab tests:", this.availableLabTests);

    this.loadAvailableMedicines();
    this.loadAvailableLabTests();
  }

  // 🔹 Load medicines for dropdown
  loadAvailableMedicines() {
    this.http.get<any[]>(`${environment.apiUrl}/PharmacistControllers/all-medicines`).subscribe({

      next: (res) => {
        console.log('Medicines loaded:', res);  // <-- Add this line
        this.availableMedicines = res;
      },

      error: () => this.toastr.error('Failed to load medicines')
    });
  }

  // 🔹 Load lab tests for dropdown
  loadAvailableLabTests() {
    this.http.get<any[]>(`${environment.apiUrl}/LabTechnician/all-lab-tests`).subscribe({
      next: (res) => {
        console.log('Test loaded:', res);  // <-- Add this line
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
    this.labTests.push({ labId: null});
  }

  removeLabTestRow(index: number) {
    if (this.labTests.length > 1) {
      this.labTests.splice(index, 1);
    }
  }

  // 🔹 Submit
  async submitConsultation() {
  try {
    // Step 1️⃣ Create Prescription
    const prescriptionRes: any = await this.http
      .post(`${environment.apiUrl}/doctor/add-prescription`, this.prescription)
      .toPromise();

    const prescriptionId = prescriptionRes.data.prescriptionId;
    console.log("preid:", prescriptionId);

    // Step 2️⃣ Add Medicines
    for (const med of this.medicines) {
      console.log('Sending medicine data:', { prescriptionId, ...med });
      await this.http
        .post(`${environment.apiUrl}/doctor/add-medicine`, {
          prescriptionId,
          ...med
        })
        .toPromise();
    }

    // Step 3️⃣ Add Lab Tests
    for (const lab of this.labTests) {
      const labId = lab.labId ?? 0; // fallback to 0 if null
      const selectedLab = this.availableLabTests.find(t => t.labId === labId || t.testId === labId);

      console.log('Sending lab test data:', { prescriptionId, labId, labName: selectedLab?.labName });

      await this.http.post(`${environment.apiUrl}/doctor/add-labtest`, {
        prescriptionId,
        labId,
        labName: selectedLab?.labName || '',
        remarks: '' // or add this property to your form if needed
      }).toPromise();
    }

    this.toastr.success('Consultation completed successfully!');
  } catch (err) {
    console.error('Consultation failed', err);
    this.toastr.error('Consultation failed');
  }
}

}
