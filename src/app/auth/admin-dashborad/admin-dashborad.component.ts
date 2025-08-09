import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashborad',
  templateUrl: './admin-dashborad.component.html',
  styleUrls: ['./admin-dashborad.component.scss']
})
export class AdminDashboardComponent {
  constructor(private router: Router) { }

  goToUserList(role: string) {
    this.router.navigate(['/admin/list', role]);
    // this.router.navigate(['/admin/list'], { queryParams: { role } });

  }
  

}
