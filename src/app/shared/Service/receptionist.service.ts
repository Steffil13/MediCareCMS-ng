import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { Appointment } from '../models/appointment.model';
import { Billing } from '../models/billing.model';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {

  private baseUrl = 'https://localhost:7288/api/Receptionist'; // Your backend URL

  constructor(private http: HttpClient) {}

  // 🧾 Patients
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/GetAllPatients`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/GetPatientById/${id}`);
  }

  addPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddPatient`, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdatePatient/${id}`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeletePatient/${id}`);
  }

  // 📅 Appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/GetAllAppointments`);
  }

  scheduleAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.baseUrl}/ScheduleAppointment`, appointment);
  }

  updateAppointment(id: number, appointment: Appointment): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateAppointment/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteAppointment/${id}`);
  }

  // 💳 Billing
  getBills(): Observable<Billing[]> {
    return this.http.get<Billing[]>(`${this.baseUrl}/GetAllBills`);
  }

  generateBill(bill: Billing): Observable<any> {
    return this.http.post(`${this.baseUrl}/GenerateBill`, bill);
  }
}
