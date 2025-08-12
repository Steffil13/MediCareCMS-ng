import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicine, PrescribedMedicine } from 'src/app/shared/model/pharmacist/prescribed-medicine';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-medicine-assign',
  templateUrl: './medicine-assign.component.html',
  styleUrls: ['./medicine-assign.component.scss']
})
export class MedicineAssignComponent implements OnInit {
  prescribedMedicineId!: number;
  prescribedMedicine?: PrescribedMedicine;
  medicines: Medicine[] = [];
  loading = false;
  error = '';

  // Replace with actual logged-in pharmacist ID from your auth/session
  currentPharmacistId = 1;
  totalAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private pharmacistService: PharmacistService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.prescribedMedicineId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Prescribed Medicine ID:', this.prescribedMedicineId);
    this.loadPrescribedMedicine();
  }

  loadPrescribedMedicine() {
    this.loading = true;
    this.pharmacistService.getPrescribedMedicineById(this.prescribedMedicineId).subscribe({
      next: (data) => {
        console.log('Prescribed medicine:', data);
        this.prescribedMedicine = data;
        this.totalAmount = this.calculateTotalAmount();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load prescribed medicine details.';
        this.loading = false;
      }
    });
  }

  calculateTotalAmount(): number {
    if (
      this.prescribedMedicine?.medicines &&
      Array.isArray(this.prescribedMedicine.medicines)
    ) {
      return this.prescribedMedicine.medicines.reduce((sum, med) => sum + (med.price ?? 0), 0);
    }
    return 0;
  }

  generatePharmacyBillId(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return 'PBL' + randomDigits;
  }

  onAssignClick() {
    const confirmed = window.confirm('Do you want to generate bill?');
    if (confirmed) {
      if (!this.prescribedMedicine) {
        alert('Prescribed medicine details not loaded.');
        return;
      }
      console.log('Current Pharmacist ID:', this.currentPharmacistId);

      const billModel = {
        prescriptionId: this.prescribedMedicine.prescriptionId,
        pmedicineId: this.prescribedMedicine.medicines && this.prescribedMedicine.medicines.length > 0
          ? this.prescribedMedicine.medicines[0].pMedicineId : 0,
        pharmacistId: this.currentPharmacistId,
        totalAmount: this.totalAmount,
        pharmacyBillId: this.generatePharmacyBillId()
      };
      console.log('Bill Model:', billModel);

      this.pharmacistService.generatePharmacyBill(billModel).subscribe({
        next: (response) => {
          console.log('Bill generation response:', response);
          // Angular HttpClient by default returns response body, so just assume success here:
          alert('Bill generated successfully');
          this.router.navigate(['/pharmacist/bill', this.prescribedMedicineId]);
        },
        error: () => {
          alert('Failed to generate bill.');
        }
      });
    } else {
      this.router.navigate(['/pharmacist/prescribed-medicines']);
    }
  }
}
