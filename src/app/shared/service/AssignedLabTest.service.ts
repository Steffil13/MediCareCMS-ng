import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Labtest } from '../model/AssignedLabTest'; 

@Injectable({
  providedIn: 'root'
})
export class LabtestService {

  private apiUrl = `${environment.apiUrl}/LabTechnician`;

  constructor(private http: HttpClient) { }

  getAllPrescribedLabTests(): Observable<Labtest[]> {
    return this.http.get<Labtest[]>(`${this.apiUrl}/get-prescribed-labtests`);
  }
}
