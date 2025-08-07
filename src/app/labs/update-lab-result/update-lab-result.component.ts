import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service'; // make sure the import path is correct
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update--result',
  templateUrl: './update-lab-result.component.html'
})
export class UpdateTestResultComponent implements OnInit {
  updateForm!: FormGroup;
  testResultId!: number;

  constructor(
    private fb: FormBuilder,
    private labTechnicianService: LabTechnicianService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.testResultId = Number(this.route.snapshot.paramMap.get('id'));

    this.updateForm = this.fb.group({
      resultValue: ['', Validators.required],
      resultStatus: [null],
      remarks: [''],
      recordDate: [this.getTodayDate()]
    });

    this.updateForm.get('resultValue')?.valueChanges.subscribe((value: string) => {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (num >= 70 && num <= 140) {
          this.updateForm.patchValue({ resultStatus: true });
        } else {
          this.updateForm.patchValue({ resultStatus: false });
        }
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.labTechnicianService.updateTestResult(this.testResultId, this.updateForm.value).subscribe({
        next: () => {
          alert('Test result updated successfully.');
        },
        error: (err: any) => {
          alert('Update failed!');
          console.error(err);
        }
      });
    }
  }
}
