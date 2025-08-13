import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PharmacistService } from 'src/app/shared/service/pharmacist.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicine-add',
  templateUrl: './medicine-add.component.html',
  styleUrls: ['./medicine-add.component.scss']
})
export class MedicineAddComponent {
  medicineForm: FormGroup;
  today: string;
  expiryMinDate: string;

  constructor(
    private fb: FormBuilder,
    private pharmacistService: PharmacistService,
    private router: Router
  ) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // ✅ today's date in YYYY-MM-DD
    this.expiryMinDate = this.today;

    this.medicineForm = this.fb.group({
      medicineName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      manufactureDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      availability: [true]
    }, { validators: this.dateValidator });
  }

  updateExpiryMinDate() {
    const mDate = this.medicineForm.get('manufactureDate')?.value;
    if (mDate) {
      this.expiryMinDate = mDate; // expiry must be after manufacture date
      const expiryControl = this.medicineForm.get('expiryDate');
      if (expiryControl?.value && expiryControl.value <= mDate) {
        expiryControl.setValue('');
      }
    }
  }

  dateValidator(group: FormGroup) {
    const manufactureDate = group.get('manufactureDate')?.value;
    const expiryDate = group.get('expiryDate')?.value;

    if (manufactureDate && expiryDate && expiryDate <= manufactureDate) {
      return { expiryBeforeManufacture: true };
    }
    return null;
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      this.pharmacistService.addMedicine(this.medicineForm.value).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Medicine added successfully',
            timer: 2000,
            showConfirmButton: false
          });
          setTimeout(() => {
            this.router.navigate(['medicines']);
          }, 2000);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add medicine'
          });
          console.error(err);
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Please fill all required fields correctly'
      });
    }
  }

  goBack() {
    this.router.navigate(['/pharmacistdashboard']);
  }
}
