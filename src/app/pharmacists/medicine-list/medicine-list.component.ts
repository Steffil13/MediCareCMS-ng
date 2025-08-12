import { Component, OnInit } from '@angular/core';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';
import { MedicineViewModel } from 'src/app/shared/model/pharmacist/medicine-view-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss']
})
export class MedicineListComponent implements OnInit {
  medicines: MedicineViewModel[] = [];
  loading = false;
  error = '';

  constructor(
    private pharmacistService: PharmacistService,
    private router: Router  // Inject Router here
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.pharmacistService.getAllMedicines().subscribe({
      next: (data) => {
        this.medicines = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load medicines.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/pharmacistdashboard']);
  }
}
