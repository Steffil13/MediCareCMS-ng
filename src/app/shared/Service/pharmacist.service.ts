import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  id?: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  medicines: Medicine[];
  date: string;
}

export interface PharmacyBill {
  patientId: number;
  prescriptionId: number;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PharmacistService {

  private apiUrl = 'https://localhost:7288/api/pharmacistcontrollers';

  constructor(private http: HttpClient) { }

  addMedicine(medicine: Medicine): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicine`, medicine);
  }

  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.apiUrl}/all-medicines`);
  }

  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/medicine/${id}`);
  }

  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/prescriptions`);
  }

  getPrescriptionById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/prescription/${id}`);
  }

  getPatientHistory(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${patientId}`);
  }

  generatePharmacyBill(bill: PharmacyBill): Observable<any> {
    return this.http.post(`${this.apiUrl}/bill`, bill);
  }

  issueMedicine(prescribedMedicineId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/issue-medicine/${prescribedMedicineId}`, null);
  }
}
