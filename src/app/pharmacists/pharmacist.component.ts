// import { Component, OnInit } from '@angular/core';
// import { Medicine, Prescription, PharmacyBill, PharmacistService } from '../shared/Service/pharmacist.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-pharmacist',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './pharmacist.component.html',
//   styleUrls: ['./pharmacist.component.scss']
// })
// export class PharmacistComponent implements OnInit {

//   medicines: Medicine[] = [];
//   prescriptions: Prescription[] = [];
//   selectedPrescription?: Prescription;
//   patientHistory: any;
//   medicineModel: Medicine = { name: '', quantity: 0, price: 0 };
//   billModel: PharmacyBill = { patientId: 0, prescriptionId: 0, amount: 0 };
//   issueMedicineId: number | null = null;

//   alertMessage: string = '';
//   alertType: 'success' | 'danger' = 'success';

//   constructor(private pharmacistService: PharmacistService) { }

//   ngOnInit() {
//     this.loadMedicines();
//     this.loadPrescriptions();
//   }

//   loadMedicines() {
//     this.pharmacistService.getAllMedicines().subscribe((data: Medicine[]) => this.medicines = data);
//   }

//   loadPrescriptions() {
//     this.pharmacistService.getAllPrescriptions().subscribe((data: Prescription[]) => this.prescriptions = data);
//   }

//   addMedicine() {
//     this.pharmacistService.addMedicine(this.medicineModel).subscribe({
//       next: () => {
//         this.alert('Medicine added successfully.', 'success');
//         this.medicineModel = { name: '', quantity: 0, price: 0 };
//         this.loadMedicines();
//       },
//       error: (err: any) => this.alert('Failed to add medicine.', 'danger')
//     });
//   }

//   viewPrescription(id: number) {
//     this.pharmacistService.getPrescriptionById(id).subscribe((data: any) => this.selectedPrescription = data);
//   }

//   getPatientHistory(patientId: number) {
//     this.pharmacistService.getPatientHistory(patientId).subscribe((data: any) => this.patientHistory = data);
//   }

//   generateBill() {
//     this.pharmacistService.generatePharmacyBill(this.billModel).subscribe({
//       next: () => {
//         this.alert('Pharmacy bill generated successfully.', 'success');
//         this.billModel = { patientId: 0, prescriptionId: 0, amount: 0 };
//       },
//       error: () => this.alert('Failed to generate bill.', 'danger')
//     });
//   }

//   issueMedicine() {
//     if (this.issueMedicineId === null) {
//       this.alert('Please enter Prescribed Medicine ID', 'danger');
//       return;
//     }

//     this.pharmacistService.issueMedicine(this.issueMedicineId).subscribe({
//       next: () => this.alert('Medicine issued successfully and stock updated.', 'success'),
//       error: () => this.alert('Unable to issue medicine. Either already issued or insufficient stock.', 'danger')
//     });
//   }

//   alert(message: string, type: 'success' | 'danger') {
//     this.alertMessage = message;
//     this.alertType = type;
//     setTimeout(() => this.alertMessage = '', 5000);
//   }
// }
