import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../model/receptionist/patient';
import { Appointment } from '../model/receptionist/appointment';
import { ConsultationBill } from '../model/receptionist/consultation-bill';
import { Department } from '../model/admin/department';
import { Doctor } from '../model/admin/doctor';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {

  private baseUrl = `${environment.apiUrl}/receptionist`;

  constructor(private http: HttpClient) { }

  // 🩺 Patient APIs
  addPatient(patient: Patient): Observable<any> {
    return this.http.post(`${this.baseUrl}/patients`, patient);
  }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/all-patients`);
  }
  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${id}`);
  }

  searchPatientByPhone(phone: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/search-patient/${phone}`);
  }

  editPatient(patient: Patient, patientId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/patients/${patientId}`, patient);
  }

  // 📅 Appointment APIs
  scheduleAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, appointment);
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments/${patientId}`);
  }

  editAppointment(appointment: Appointment): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-appointment`, appointment);
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-appointment/${appointmentId}`);
  }

  getBills(): Observable<ConsultationBill[]> {
    return this.http.get<ConsultationBill[]>(`${this.baseUrl}/receptionist/bills`);
  }

  getBillById(billId: number): Observable<ConsultationBill> {
    return this.http.get<ConsultationBill>(`${this.baseUrl}/receptionist/bills/${billId}`);
  }

  generateBill(appointmentId: number): Observable<ConsultationBill> {
    return this.http.post<ConsultationBill>(`${this.baseUrl}/billings`, { appointmentId });
  }
  searchPatientsByRegisterNumber(registerNumber: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/patients/search`, {
      params: { registerNumber }
    });
  }

  generateBillForPatient(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/billings`);
  }
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${environment.apiUrl}/admin/departments`);
  }

  getDoctorsByDepartment(departmentId: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/doctors/by-department/${departmentId}`);
  }


}
