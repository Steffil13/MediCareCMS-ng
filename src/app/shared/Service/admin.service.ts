import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/admin/user.model';
import { UserInput } from '../model/admin/user-input';
import { Department } from '../model/admin/department';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseUrl = 'https://localhost:7288/api/admin';

  constructor(private http: HttpClient) { }

  // ==== USERS ====

  // if backend `users` returns all staff, we can reuse this
  getAllStaff(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
    // OR if backend has a dedicated endpoint:
    // return this.http.get<User[]>(`${this.baseUrl}/staff`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createStaff(input: UserInput): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/CreateStaff`, input);
  }

  // updateStaff(id: number, input: UserInput): Observable<User> {
  //   return this.http.put<User>(`${this.baseUrl}/UpdateStaff/${id}`, input);
  // }

  // deactivateStaff(id: number): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/DeactivateStaff/${id}`, {});
  // }

  // ==== DEPARTMENTS ====

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments`);
  }

  addDepartment(input: { departmentName: string; doctorFee: number }): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/departments`, input);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/departments/${id}`);
  }

  // ==== ROLES ====

  getRoles(): Observable<{ roleId: number; roleName: string }[]> {
    return this.http.get<{ roleId: number; roleName: string }[]>(`${this.baseUrl}/roles`);
  }
  updateStaff(id: number, input: any): Observable<string> {
    return this.http.put(`${this.baseUrl}/UpdateStaff/${id}`, input, { responseType: 'text' });
  }
  deactivateStaff(id: number): Observable<string> {
    return this.http.put<string>(`${this.baseUrl}/DeactivateStaff/${id}`, {}, { responseType: 'text' as 'json' });
  }


}
