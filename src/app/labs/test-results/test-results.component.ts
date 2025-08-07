import { Component, OnInit } from '@angular/core';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { TestResult, UpdateTestResultViewModel } from 'src/app/shared/model/labtech/labtech';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html'
})
export class TestResultsComponent implements OnInit {
  testResults: TestResult[] = [];
  selectedTest?: TestResult;
  updateForm: FormGroup;
  showUpdateForm: boolean = false;

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
    });
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
      this.service.updateTestResult(this.selectedTest.testResultId, this.updateForm.value).subscribe(() => {
        alert('Test result updated!');
        this.showUpdateForm = false;
        this.fetchResults();
      });
    }
  }
}
