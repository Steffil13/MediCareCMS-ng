import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TestResult, UpdateTestResult, } from '../model/labtech/labtech';

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
    return this.http.post(`${this.apiUrl}/add-labtest`, data);
  }


  getAllPrescribedLabTests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-prescribed-labtests`);
  }

  assignLabTest(assignData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-labtest`, assignData);
  }

  getAllTestResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/view-all-test-results`);
  }
  generateLabBill(billData: any) {
    return this.http.post(`${this.apiUrl}/bill`, billData);
  }

 updateTestResult(id: number, data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/LabTechnician/update-test-result/${id}`, data);
}

}
