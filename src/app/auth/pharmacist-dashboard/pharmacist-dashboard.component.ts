import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pharmacist-dashboard',
  templateUrl: './pharmacist-dashboard.component.html',
  styleUrls: ['./pharmacist-dashboard.component.scss']
})
export class PharmacistDashboardComponent {
  constructor(private router: Router) {}

  viewPrescriptions() {
  this.router.navigate(['/pharmacist/prescribed-medicines']);  // Correct path in your routes
  }

  viewPatientHistory() {
  this.router.navigate(['/patient-history']);
}


  addMedicine() {
    this.router.navigate(['/pharmacist/add-medicine']);
  }

  viewMedicines() {
    this.router.navigate(['/pharmacist/medicines']);
  }

  viewBillHistory() {
    this.router.navigate(['/pharmacist/bill-history']);
  }
}
