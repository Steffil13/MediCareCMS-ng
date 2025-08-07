import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  goToUserList(role: string): void {
    // Navigate to /admin/users?role=Doctor or Receptionist etc.
    this.router.navigate(['/admin/list'], { queryParams: { role } });
  }
}
