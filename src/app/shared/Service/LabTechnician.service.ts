import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LabBillViewModel, TestResult, } from '../model/labtech/labtech';
import { LabTest } from '../model/labtech/labtest';
import { TestResultHistory } from '../model/labtech/AssignedLabTest';
import { LabBill } from '../model/labtech/labbill';

@Injectable({
  providedIn: 'root'
})
export class LabTechnicianService {


  private apiUrl = `${environment.apiUrl}/LabTechnician`;

  constructor(private http: HttpClient) { }


  getAllLabInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-lab-inventory`);
  }

  addLabTest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-lab-test`, data);
  }


  getAllPrescribedLabTests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alllabtests`);
  }

  assignLabTest(assignData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-labtest`, assignData);
  }

  getAllTestResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/alllabtests`);
  }


  getLabTestsByPrescription(prescriptionId: number): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.apiUrl}/labtests/by-prescription/${prescriptionId}`);
  }

  getPrescriptionDetails(prescriptionId: number): Observable<{ patientId: number; doctorId: number; labTechnicianId: number }> {
    return this.http.get<{ patientId: number; doctorId: number; labTechnicianId: number }>(
      `${this.apiUrl}/prescription-details/${prescriptionId}`
    );
  }

    generateLabBill(billModel: LabBillViewModel): Observable<LabBill> {
    return this.http.post<LabBill>(`${this.apiUrl}/generate-lab-bill`, billModel);
  }

  getBillById(billId: number) {
    return this.http.get(`${this.apiUrl}/bill/${billId}`);
  }

   getTestResultsHistory(): Observable<TestResultHistory[]> {
    return this.http.get<TestResultHistory[]>(`${this.apiUrl}/history`);
  }

  updateTestResult(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-test-result/${id}`, data);
  }
  getTestResultById(pLabTestId: number) {
    return this.http.get<any>(`${this.apiUrl}/lab-test/${pLabTestId}`);
  }


}
