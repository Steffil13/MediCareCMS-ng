import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ✅ import Router

@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.component.html',
  styleUrls: ['./lab-dashboard.component.scss']
})
export class LabDashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToTestResults() {
    this.router.navigate(['/testresults']);
  }
}
