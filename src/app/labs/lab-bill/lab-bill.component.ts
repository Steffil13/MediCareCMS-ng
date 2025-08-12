import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';

@Component({
  selector: 'app-lab-bill',
  templateUrl: './lab-bill.component.html',
})
export class LabBillComponent implements OnInit {
  bill: any;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private labTechnicianService: LabTechnicianService
  ) {}

  ngOnInit(): void {
    const billId = Number(this.route.snapshot.paramMap.get('billId'));
    if (billId) {
      this.loadBill(billId);
    } else {
      this.errorMessage = 'Invalid Bill ID.';
    }
  }

  loadBill(billId: number): void {
    this.loading = true;
    this.labTechnicianService.getBillById(billId).subscribe({
      next: (data) => {
        this.bill = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not fetch bill details.';
        this.loading = false;
        console.error('Failed to load bill:', err);
      },
    });
  }

  printBill(): void {
    window.print();
  }
}
