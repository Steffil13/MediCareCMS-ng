import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacyBill } from 'src/app/shared/model/pharmacist/medicine';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.component.html',
  styleUrls: ['./bill-history.component.scss']
})
export class BillHistoryComponent implements OnInit {
  bills: PharmacyBill[] = [];
  loading = true;
  errorMessage = '';

  constructor(private pharmacistService: PharmacistService, private router: Router) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.errorMessage = '';
    this.pharmacistService.getAllBills().subscribe({
      next: (data) => {
        console.log("pharmabill data", data);
        this.bills = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bills', err);
        this.errorMessage = 'Failed to load pharmacy bills.';
        this.loading = false;
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/pharmacistdashboard']);
  }
}
