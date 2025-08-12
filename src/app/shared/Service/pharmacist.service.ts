import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrescribedMedicine } from '../model/pharmacist/prescribed-medicine';
import { PharmacyBillViewModel } from '../model/pharmacist/pharmacy-bill-view-model';
import { MedicineViewModel } from '../model/pharmacist/medicine-view-model';
import { BillHistory } from '../model/labtech/labbill';
import { PharmacyBill } from '../model/pharmacist/medicine';

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


@Injectable({
  providedIn: 'root'
})
export class PharmacistService {

  private apiUrl = 'https://localhost:7288/api/pharmacistcontrollers';

  constructor(private http: HttpClient) { }

  addMedicine(medicine: Medicine): Observable<string> {
    return this.http.post(`${this.apiUrl}/medicine`, medicine, { responseType: 'text' });
  }


  getAllMedicines(): Observable<MedicineViewModel[]> {
    return this.http.get<MedicineViewModel[]>(`${this.apiUrl}/all-medicines`);
  }


  getMedicineById(id: number): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/medicine/${id}`);
  }

  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/prescriptions`);
  }

  getPrescribedMedicines(): Observable<PrescribedMedicine[]> {
    return this.http.get<PrescribedMedicine[]>(`${this.apiUrl}/prescriptions`);
  }

  getPatientHistory(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${patientId}`);
  }

  getAllBills(): Observable<PharmacyBill[]> {
    return this.http.get<PharmacyBill[]>(`${this.apiUrl}/bill-history`);
  }

  issueMedicine(prescribedMedicineId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/issue-medicine/${prescribedMedicineId}`, null);
  }

  getPrescribedMedicineById(id: number): Observable<PrescribedMedicine> {
    return this.http.get<PrescribedMedicine>(`${this.apiUrl}/prescription/${id}`);
  }

  // Add this method to generate bill (example input)
  // generateBill(model: { prescriptionId: number; patientId: number; totalAmount: number; }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/bill`, model);
  // }

  generatePharmacyBill(model: PharmacyBillViewModel) {
    return this.http.post(`${this.apiUrl}/bill`, model, { observe: 'response' });
  }

  getAllPatientHistories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/all`);
  }


  getPharmacyBillByPrescribedMedicineId(pmId: number) {
    return this.http.get<PharmacyBillViewModel>(`${this.apiUrl}/bill/by-prescribed-medicine/${pmId}`);
  }
}
