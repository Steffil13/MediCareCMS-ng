import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medicine, PrescribedMedicine } from 'src/app/shared/model/pharmacist/prescribed-medicine';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';
import Swal from 'sweetalert2';

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

  currentPharmacistId = 1;
  totalAmount = 0;

  constructor(
    private route: ActivatedRoute,
    private pharmacistService: PharmacistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.prescribedMedicineId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("sssss", this.prescribedMedicineId);
    
    this.loadPrescribedMedicine();
  }

  /** Load prescribed medicine details */
  loadPrescribedMedicine() {
    this.loading = true;
    this.pharmacistService.getPrescribedMedicineById(this.prescribedMedicineId).subscribe({
      next: (data) => {
        this.prescribedMedicine = data;
        this.totalAmount = this.calculateTotalAmount();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load prescribed medicine details.';
        Swal.fire('Error', this.error, 'error');
        this.loading = false;
      }
    });
  }

  /** Calculate total amount of all medicines */
  calculateTotalAmount(): number {
    return this.prescribedMedicine?.medicines?.reduce(
      (sum, med) => sum + (med.price ?? 0),
      0
    ) ?? 0;
  }

  /** Generate unique Pharmacy Bill ID */
  generatePharmacyBillId(): string {
    return 'PBL' + Math.floor(1000 + Math.random() * 9000);
  }

  /** Handle Assign (Bill Generation) */
  onAssignClick() {
    Swal.fire({
      title: 'Generate Bill?',
      text: 'Do you want to generate the pharmacy bill now?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c3256', // navy theme
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, generate it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed && this.prescribedMedicine) {
        const billModel = {
          prescriptionId: this.prescribedMedicine.prescriptionId,
          pmedicineId: this.prescribedMedicine.medicines?.[0]?.pMedicineId || 0,
          pharmacistId: this.currentPharmacistId,
          totalAmount: this.totalAmount,
          pharmacyBillId: this.generatePharmacyBillId(),
          doctorName: `${this.prescribedMedicine.doctorFirstName} ${this.prescribedMedicine.doctorLastName}`,
          patientName: `${this.prescribedMedicine.patientFirstName} ${this.prescribedMedicine.patientLastName}`,
          medicines: (this.prescribedMedicine.medicines?.map(m => m.medicineName).filter((name): name is string => !!name)) || [],
          issuedDate: new Date()
        };


        Swal.fire({
          title: 'Generating Bill...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        this.pharmacistService.generatePharmacyBill(billModel).subscribe({
          next: () => {
            Swal.close();
            Swal.fire('Success', 'Bill generated successfully', 'success').then(() => {
              this.router.navigate(['/pharmacist/bill', this.prescribedMedicineId]);
            });
          },
          error: () => {
            Swal.close();
            Swal.fire('Error', 'Failed to generate bill', 'error');
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Bill generation cancelled', 'info').then(() => {
          this.router.navigate(['/pharmacist/prescribed-medicines']);
        });
      }
    });
  }

  /** Navigate back to pharmacist dashboard with SweetAlert confirmation */
  onCancelClick() {
    Swal.fire({
      title: 'Return to Dashboard?',
      text: 'Are you sure you want to go back to the dashboard?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c3256', // navy theme
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, go back',
      cancelButtonText: 'Stay here'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/pharmacistdashboard']);
      }
    });
  }
}
