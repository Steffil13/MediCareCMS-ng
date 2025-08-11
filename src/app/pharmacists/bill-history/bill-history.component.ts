import { Component, OnInit } from '@angular/core';
import { BillHistory } from 'src/app/shared/model/labtech/labbill';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-bill-history',
  templateUrl: './bill-history.component.html'
})
export class BillHistoryComponent implements OnInit {
  billHistory: BillHistory[] = [];
  loading = true;

  constructor(private pharmacistService: PharmacistService) {}

  ngOnInit(): void {
    this.pharmacistService.getBillHistory().subscribe({
      next: (data) => {
        console.log('Bill history:', data);
        this.billHistory = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bill history', err);
        this.loading = false;
      }
    });
  }
}
