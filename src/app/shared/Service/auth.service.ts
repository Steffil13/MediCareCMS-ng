import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { users } from '../model/users';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getDoctorId(): number {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return user?.doctorId;
  }

  constructor(private httpClient: HttpClient, 
    private router: Router) { }
    //login 
    public loginVerify(user: users): Observable<any>{
      return this.httpClient.get<users>(environment.apiUrl + '/Logins/' + user.userName + '/' + user.password

      );
    }

    //logout
    public logoutWithClearKeyValues(){
      // clear all session and local storage
      localStorage.removeItem("USER_NAME");
      localStorage.removeItem("ACCESS_ROLE");
      localStorage.removeItem("JWT_TOKEN");

      //redirect to login
      this.router.navigate(['auth/login']);
    }
}
