import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LabTest } from 'src/app/shared/model/labtech/labtest';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

@Component({
  selector: 'app-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.scss']
})
export class LabtestListComponent implements OnInit {
  labTests: LabTest[] = [];
  loading = false;
  error = '';

  constructor(private labService: LabTechnicianService, private router: Router) {}

  ngOnInit(): void {
    this.loadLabTests();
  }

  loadLabTests(): void {
    this.loading = true;
    this.labService.getAllLabTests().subscribe({
      next: (data) => {
        console.log('Lab tests:', data);
        this.labTests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load lab tests.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/labdashboard']);  // Change route as needed
  }
}
