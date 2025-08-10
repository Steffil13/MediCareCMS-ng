// src/app/doctor/prescribed-labtest/prescribed-labtest.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from 'src/app/shared/Service/doctor.service';

@Component({
  selector: 'app-prescribed-labtest',
  templateUrl: './prescribed-labtest.component.html'
})
export class PrescribedLabtestComponent implements OnInit {
  labTestForm!: FormGroup;
  prescriptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.labTestForm = this.fb.group({
      prescriptionId: ['', Validators.required],
      testName: ['', Validators.required]
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
    if (this.labTestForm.invalid) return;

    this.doctorService.addLabTest(this.labTestForm.value).subscribe({
      next: () => {
        this.toastr.success('Lab test added');
        this.labTestForm.reset();
      },
      error: () => this.toastr.error('Failed to add lab test')
    });
  }
}
