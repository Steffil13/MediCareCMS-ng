import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabBill } from 'src/app/shared/model/labtech/labbill';
import { LabBillViewModel } from 'src/app/shared/model/labtech/labtech';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-result',
  templateUrl: './update-lab-result.component.html',
  styleUrls: ['./update-lab-result.component.scss']
})
export class UpdateTestResultComponent implements OnInit {
  updateForm!: FormGroup;
  pLabTestId!: number;

  private prescriptionId = 0;
  private labTechnicianId = 0;
  private patientId = 0;
  private doctorId = 0;
  private testPrice = 0;

  constructor(
    private fb: FormBuilder,
    private labTechnicianService: LabTechnicianService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const routeId = params.get('plabTestId');
      if (routeId) {
        this.pLabTestId = Number(routeId);
        localStorage.setItem('pLabTestId', routeId);
      } else {
        const storedId = localStorage.getItem('pLabTestId');
        this.pLabTestId = storedId ? Number(storedId) : 0;
      }

      this.loadLabTestDetails(this.pLabTestId);
    });

    this.initForm();
  }

  initForm() {
    this.updateForm = this.fb.group({
      resultValue: ['', Validators.required],
      resultStatus: [null],
      remarks: [''],
      recordDate: [this.getTodayDate()]
    });

    // Auto-set resultStatus based on numeric resultValue between 70 and 140
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
    return new Date().toISOString().split('T')[0];
  }

  loadLabTestDetails(plabTestId: number) {
    if (!plabTestId) {
      this.toastr.error('Invalid Lab Test ID', 'Error');
      return;
    }

    this.labTechnicianService.getTestResultById(plabTestId).subscribe({
      next: details => {
        this.prescriptionId = details.prescriptionId;
        this.labTechnicianId = details.labTechnicianId;
        this.patientId = details.patientId;
        this.doctorId = details.doctorId;
        this.testPrice = details.price;
      },
      error: () => {
        this.toastr.error('Failed to load lab test details', 'Error');
      }
    });
  }

  calculateTotalAmount(): number {
    return this.testPrice || 0;
  }

  onSubmit() {
    if (this.updateForm.invalid || !this.pLabTestId) {
      this.toastr.warning('No test selected to update or form invalid', 'Validation');
      return;
    }

    this.labTechnicianService.updateTestResult(this.pLabTestId, this.updateForm.value).subscribe({
      next: () => {
        this.toastr.success('Test result updated successfully', 'Success');

        const billModel: LabBillViewModel = {
          prescriptionId: this.prescriptionId,
          labTechnicianId: this.labTechnicianId,
          patientId: this.patientId,
          doctorId: this.doctorId,
          totalAmount: this.calculateTotalAmount(),
        };

        this.labTechnicianService.generateLabBill(billModel).subscribe({
          next: (bill: LabBill) => {
            this.toastr.success(`Lab bill generated successfully. Bill Number: ${bill.labBillNumber}`, 'Success');
            this.router.navigate(['/labtechnician/bill', bill.labBillId]);
          },
          error: err => {
            this.toastr.error('Failed to generate lab bill', 'Error');
            console.error('GenerateLabBill error:', err);
          }
        });
      },
      error: err => {
        this.toastr.error('Failed to update test result', 'Error');
        console.error('UpdateTestResult error:', err);
      }
    });
  }
}
