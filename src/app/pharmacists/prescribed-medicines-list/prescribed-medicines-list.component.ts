import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrescribedMedicine } from 'src/app/shared/model/pharmacist/prescribed-medicine';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';

@Component({
  selector: 'app-prescribed-medicines-list',
  templateUrl: './prescribed-medicines-list.component.html',
  styleUrls: ['./prescribed-medicines-list.component.scss']
})
export class PrescribedMedicinesListComponent implements OnInit {
  prescribedMedicines: PrescribedMedicine[] = [];
  loading = false;
  error = '';

  constructor(
    private pharmacistService: PharmacistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPrescribedMedicines();
  }

  private loadPrescribedMedicines(): void {
    this.loading = true;
    this.pharmacistService.getPrescribedMedicines().subscribe({
      next: (data) => {
        console.log('Prescribed medicines:', data);
        // Only show medicines not yet issued
        this.prescribedMedicines = data.filter(pm => !pm.isIssued);
        //this.prescribedMedicines = data
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load prescribed medicines.';
        this.loading = false;
      }
    });
  }

  onAssign(pmId: number) {
    // Navigate to assign-medicine page
    console.log('Assigning medicine for PM ID:', pmId);
    
    this.router.navigate(['/pharmacist/assign-medicine', pmId]).then(() => {
      // After navigation, you could issue medicine directly if required
      this.pharmacistService.issueMedicine(pmId).subscribe({
        next: () => {
          // Remove issued medicine from list
          this.prescribedMedicines = this.prescribedMedicines.filter(pm => pm.pMedicineId !== pmId);
        },
        error: (err) => {
          console.error('Error issuing medicine:', err);
          this.error = 'Failed to issue medicine.';
        }
      });
    });
  }
}