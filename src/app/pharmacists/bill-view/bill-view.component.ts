import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PharmacyBillViewModel } from 'src/app/shared/model/pharmacist/pharmacy-bill-view-model';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit {
  pmId!: number;
  bill?: PharmacyBillViewModel;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private pharmacistService: PharmacistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // **Use lowercase 'id' matching your route**
    this.pmId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Bill View pmId:', this.pmId);
    this.loadBill();
  }

  loadBill() {
    this.loading = true;
    this.pharmacistService.getPharmacyBillByPrescribedMedicineId(this.pmId).subscribe({
      next: (data) => {
        this.bill = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bill data.';
        this.loading = false;
      }
    });
  }

  printBill() {
    window.print();
  }

  cancel() {
    this.router.navigate(['/pharmacist/prescribed-medicines']);
  }
}
