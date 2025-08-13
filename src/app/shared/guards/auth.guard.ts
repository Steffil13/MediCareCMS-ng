import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('ACCESS_ROLE');
    if (userRole == '1') {
      return true;
    }
    else if (userRole == '2'){
      return true;

    }
    else if (userRole == '3'){
      return true;

    }
    else if (userRole == '4'){
      return true;

    }
    else if (userRole == '5'){
      return true;

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
