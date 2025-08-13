import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrescribedMedicine } from 'src/app/shared/model/pharmacist/prescribed-medicine';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPrescribedMedicines();
  }

  private loadPrescribedMedicines(): void {
    this.loading = true;
    this.error = '';

    this.pharmacistService.getPrescribedMedicines().subscribe({
      next: (data) => {
        console.log('Prescribed medicines:', data);
        // Only show medicines not yet issued
        this.prescribedMedicines = data.filter(pm => !pm.isIssued);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load prescribed medicines.';
        this.toastr.error(this.error, 'Error');
        this.loading = false;
      }
    });
  }

  onAssign(pmId: number) {
    // ✅ Navigate to the Assign Medicine page only
    console.log('Navigating to assign medicine for PM ID:', pmId);
    this.router.navigate(['/pharmacist/assign-medicine', pmId]);
   
    // ❌ Avoid issuing directly here unless intentional
    // If you really need to issue instantly, use the code below:
    
    // this.pharmacistService.issueMedicine(pmId).subscribe({
    //   next: () => {
    //     this.toastr.success('Medicine issued successfully', 'Success');
    //     // Remove issued medicine from the list
    //     this.prescribedMedicines = this.prescribedMedicines.filter(pm => pm.pMedicineId !== pmId);
    //   },
    //   error: (err) => {
    //     console.error('Error issuing medicine:', err);
    //     this.toastr.error('Failed to issue medicine', 'Error');
    //   }
    // });
    
  }

  goBack() {
    this.router.navigate(['/pharmacistdashboard']);
  }
}
