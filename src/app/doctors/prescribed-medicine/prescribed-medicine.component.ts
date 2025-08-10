// src/app/doctor/prescribed-medicine/prescribed-medicine.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/shared/Service/doctor.service';

@Component({
  selector: 'app-prescribed-medicine',
  templateUrl: './prescribed-medicine.component.html'
})
export class PrescribedMedicineComponent implements OnInit {
  medicineForm!: FormGroup;
  prescriptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.medicineForm = this.fb.group({
      prescriptionId: ['', Validators.required],
      medicineName: ['', Validators.required],
      dosage: ['', Validators.required]
    });

    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.doctorService.getPrescriptions().subscribe({
      next: (res) => this.prescriptions = res,
      error: () => this.toastr.error('Failed to load prescriptions')
    });
  }

  onSubmit() {
    if (this.medicineForm.invalid) return;

    this.doctorService.addMedicine(this.medicineForm.value).subscribe({
      next: () => {
        this.toastr.success('Medicine added to prescription');
        this.medicineForm.reset();
      },
      error: () => this.toastr.error('Failed to add medicine')
    });
  }
}
