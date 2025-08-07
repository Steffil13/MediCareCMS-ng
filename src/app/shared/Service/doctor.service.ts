// src/app/shared/Service/doctor.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 Get appointments for logged-in doctor
  getDoctorAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/doctor`);
  }

  // 🔹 Create a new prescription
  createPrescription(prescription: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions`, prescription);
  }

  // 🔹 Get all prescriptions by doctor
  getPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prescriptions/doctor`);
  }

  // 🔹 Add medicine to a prescription
  addMedicineToPrescription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions/${data.prescriptionId}/medicines`, data);
  }

  // 🔹 Add lab test to a prescription
  addLabTestToPrescription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions/${data.prescriptionId}/labtests`, data);
  }

  // 🔹 Get prescribed medicines by prescription ID
  getPrescribedMedicines(prescriptionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prescriptions/${prescriptionId}/medicines`);
  }

  // 🔹 Get prescribed lab tests by prescription ID
  getPrescribedLabTests(prescriptionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prescriptions/${prescriptionId}/labtests`);
  }

  // ✅ Add a prescribed medicine to a prescription
  addMedicine(medicineData: any) {
    return this.http.post(`${this.apiUrl}/Doctor/PrescribedMedicines`, medicineData);
  }

  // ✅ Add a prescribed lab test to a prescription
  addLabTest(labTestData: any) {
    return this.http.post(`${this.apiUrl}/Doctor/PrescribedLabTests`, labTestData);
  }

  //2. Get appointments for the doctor
  getAppointmentsByDoctorId(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor/appointments`);
  }
}
