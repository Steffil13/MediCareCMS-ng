// src/app/doctor/prescription-create/prescription-create.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/shared/Service/doctor.service';

@Component({
  selector: 'app-prescription-create',
  templateUrl: './prescription-create.component.html'
})
export class PrescriptionCreateComponent implements OnInit {
  prescriptionForm!: FormGroup;
  appointments: any[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.prescriptionForm = this.fb.group({
      appointmentId: ['', Validators.required],
      notes: ['', Validators.required]
    });

    this.loadAppointments();
  }

  loadAppointments() {
    this.doctorService.getDoctorAppointments().subscribe({
      next: (res) => this.appointments = res,
      error: () => this.toastr.error('Failed to load appointments')
    });
  }

  onSubmit() {
    if (this.prescriptionForm.invalid) return;

    this.doctorService.createPrescription(this.prescriptionForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Prescription created');
        this.prescriptionForm.reset();
      },
      error: () => this.toastr.error('Failed to create prescription')
    });
  }
}
