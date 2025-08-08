import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-result',
  templateUrl: './update-lab-result.component.html'
})
export class UpdateTestResultComponent implements OnInit {
  updateForm!: FormGroup;
  pLabTestId!: number;

  constructor(
    private fb: FormBuilder,
    private labTechnicianService: LabTechnicianService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    // 1️⃣ First try to get from route params
    this.route.paramMap.subscribe(params => {
      const routeId = params.get('plabTestId');
      console.log('Route param pLabTestId:', routeId);
      
      if (routeId) {
        this.pLabTestId = Number(routeId);
        localStorage.setItem('pLabTestId', routeId); // store for refresh
      } else {
        // 2️⃣ If no route param, fall back to localStorage
        const storedId = localStorage.getItem('pLabTestId');
        this.pLabTestId = storedId ? Number(storedId) : 0;
      }
      console.log('Selected pLabTestId:', this.pLabTestId);
    });

    // 3️⃣ Initialize the form
    this.initForm();
  }

  initForm() {
    this.updateForm = this.fb.group({
      resultValue: ['', Validators.required],
      resultStatus: [null],
      remarks: [''],
      recordDate: [this.getTodayDate()]
    });

    // Auto-update resultStatus based on resultValue
    this.updateForm.get('resultValue')?.valueChanges.subscribe((value: string) => {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        this.updateForm.patchValue(
          { resultStatus: num >= 70 && num <= 140 },
          { emitEvent: false }
        );
      }
    });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.updateForm.valid && this.pLabTestId) {
      this.labTechnicianService
        .updateTestResult(this.pLabTestId, this.updateForm.value)
        .subscribe({
          next: () => {
            alert('Test result updated successfully.');
          },
          error: (err: any) => {
            alert('Update failed!');
            console.error(err);
          }
        });
    } else {
      alert('No test selected to update.');
    }
    
  }
}
