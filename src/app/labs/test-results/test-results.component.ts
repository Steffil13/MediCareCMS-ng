import { Component, OnInit } from '@angular/core';
import { TestResultHistory } from 'src/app/shared/model/labtech/AssignedLabTest';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent implements OnInit {
  testResults: TestResultHistory[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private labTechService: LabTechnicianService,
    private router: Router
  ) {}

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

  goBackToDashboard(): void {
    this.router.navigate(['/labdashboard']);
  }

  printResult(result: TestResultHistory): void {
    Swal.fire({
      title: `Print result for ${result.patientName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Print',
      cancelButtonText: 'No',
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#3a3b78'
    }).then((res) => {
      if (res.isConfirmed) {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Test Result - ${result.patientName}</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background: linear-gradient(to top,  #1515a2ff, #ffe5e5);
                    color: #000;
                  }
                  h2 {
                    text-align: center;
                    margin-bottom: 20px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #fff;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  }
                  th, td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                  }
                  th {
                    background: #1515a2ff;
                    color: #ffffffff;
                  }
                </style>
              </head>
              <body>
                <h2>Medi Care+ - Test Result</h2>
                <table>
                  <tr><th>Register Number</th><td>${result.registerNumber}</td></tr>
                  <tr><th>Patient Name</th><td>${result.patientName}</td></tr>
                  <tr><th>Test Name</th><td>${result.testName}</td></tr>
                  <tr><th>Result</th><td>${result.resultValue}</td></tr>
                  <tr><th>Remarks</th><td>${result.remarks}</td></tr>
                  <tr><th>Status</th><td>${result.resultStatus ? 'Positive' : 'Negative'}</td></tr>
                  <tr><th>Record Date</th><td>${new Date(result.recordDate).toLocaleString()}</td></tr>
                </table>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    });
  }
}
