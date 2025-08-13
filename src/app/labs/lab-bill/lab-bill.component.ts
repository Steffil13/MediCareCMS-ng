import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabTechnicianService } from 'src/app/shared/service/LabTechnician.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lab-bill',
  templateUrl: './lab-bill.component.html',
  styleUrls: ['./lab-bill.component.scss']
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
        console.log("bill details", data);
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
    Swal.fire({
      title: 'Do you want to print the bill?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Print',
      cancelButtonText: 'No',
      confirmButtonColor: '#12126a', // navy theme color
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        window.print();
      }
    });
  }
}
