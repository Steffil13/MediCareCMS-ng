import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LabBill, LabBillViewModel } from 'src/app/shared/model/labtech/labbill';
import { LabTest } from 'src/app/shared/model/labtech/labtest';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

// Import models and service


@Component({
  selector: 'app-lab-bill',
  templateUrl: './lab-bill.component.html',
})
export class LabBillComponent implements OnInit {
  billModel!: LabBillViewModel;
  generatedBill?: LabBill;
  errorMessage?: string;

  constructor(private route: ActivatedRoute, private labService: LabTechnicianService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const prescriptionId = +params['prescriptionId'];
      if (prescriptionId) {
        this.loadLabTestsAndGenerateBill(prescriptionId);
      } else {
        this.errorMessage = 'Prescription ID is missing in the URL.';
      }
    });
  }

  loadLabTestsAndGenerateBill(prescriptionId: number) {
    this.labService.getLabTestsByPrescription(prescriptionId).subscribe({
      next: (labTests: LabTest[]) => {
        if (labTests.length === 0) {
          this.errorMessage = 'No lab tests found for this prescription.';
          return;
        }

        const totalAmount = labTests.reduce((sum, test) => sum + test.price, 0);

        this.labService.getPrescriptionDetails(prescriptionId).subscribe({
          next: (details: { patientId: any; doctorId: any; labTechnicianId: any; }) => {
            this.billModel = {
              prescriptionId,
              patientId: details.patientId,
              doctorId: details.doctorId,
              labTechnicianId: details.labTechnicianId,
              totalAmount,
            };

            this.generateLabBill();
          },
          error: () => {
            this.errorMessage = 'Failed to load prescription details.';
          },
        });
      },
      error: () => {
        this.errorMessage = 'Failed to load lab tests.';
      },
    });
  }

  generateLabBill() {
    this.labService.generateLabBill(this.billModel).subscribe({
      next: (bill: any) => {
        this.generatedBill = bill;
        this.errorMessage = undefined;
      },
      error: () => {
        this.errorMessage = 'Failed to generate lab bill.';
      },
    });
  }
}
