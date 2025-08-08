import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LabBillViewModel, TestResult, UpdateTestResult, } from '../model/labtech/labtech';

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
    return this.http.get<any[]>(`${this.apiUrl}/alllabtests`);
  }

  assignLabTest(assignData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-labtest`, assignData);
  }

  getAllTestResults() {
    return this.http.get<TestResult[]>(`${this.apiUrl}/alllabtests`);
  }

   generateLabBill(bill: LabBillViewModel): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/generate-lab-bill`, bill);
}


  getBillById(billId: number) {
    return this.http.get(`${this.apiUrl}/bill/${billId}`);
  }


  updateTestResult(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-test-result/${id}`, data);
  }
  getTestResultById(pLabTestId: number) {
    return this.http.get<any>(`${this.apiUrl}/labtechnician/testresult/${pLabTestId}`);
  }


}
