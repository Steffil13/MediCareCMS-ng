import { Component, OnInit } from '@angular/core';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { TestResult } from 'src/app/shared/model/labtech/labtech';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss']
})
export class TestResultsComponent implements OnInit {
  testResults: TestResult[] = [];
  filteredResults: TestResult[] = [];
  selectedTest?: TestResult;
  updateForm: FormGroup;
  showUpdateForm: boolean = false;

  searchPatientName: string = '';

  constructor(private service: LabTechnicianService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      resultValue: [''],
      resultStatus: [false],
      remarks: ['']
    });
  }

  ngOnInit() {
    this.fetchResults();
  }

  fetchResults() {
    this.service.getAllTestResults().subscribe(data => {
      this.testResults = data;
      this.filteredResults = data;
    });
  }

  filterResults() {
    const searchTerm = this.searchPatientName.trim().toLowerCase();
    if (!searchTerm) {
      this.filteredResults = this.testResults;
      return;
    }
    this.filteredResults = this.testResults.filter(result =>
      result.patientName?.toLowerCase().includes(searchTerm)
    );
  }

  editTest(test: TestResult) {
    this.selectedTest = test;
    this.showUpdateForm = true;
    this.updateForm.patchValue({
      resultValue: test.resultValue,
      resultStatus: test.resultStatus,
      remarks: test.remarks
    });
  }

  submitUpdate() {
    if (this.selectedTest) {
      this.service.updateTestResult(this.selectedTest.registerNumber, this.updateForm.value).subscribe(() => {
        alert('Test result updated!');
        this.showUpdateForm = false;
        this.fetchResults();
      });
    }
  }
}
