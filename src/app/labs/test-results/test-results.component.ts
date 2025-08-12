import { Component, OnInit } from '@angular/core';
import { TestResultHistory } from 'src/app/shared/model/labtech/AssignedLabTest';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent implements OnInit {
  testResults: TestResultHistory[] = [];
  loading = true;
  errorMessage = '';

  constructor(private labTechService: LabTechnicianService) {}

  ngOnInit(): void {
    this.loadTestResults();
  }

  loadTestResults(): void {
    this.labTechService.getTestResultsHistory().subscribe({
      next: (data) => {
        console.log('Test results history:', data);
        this.testResults = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load test results history';
        this.loading = false;
      }
    });
  }
}
