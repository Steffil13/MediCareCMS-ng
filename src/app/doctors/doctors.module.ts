import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorAppointmentsComponent } from './appointments/appointments.component';
import { PrescriptionCreateComponent } from './prescription-create/prescription-create.component';
import { PrescriptionViewComponent } from './prescription-view/prescription-view.component';
import { PrescribedMedicineComponent } from './prescribed-medicine/prescribed-medicine.component';
import { PrescribedLabtestComponent } from './prescribed-labtest/prescribed-labtest.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DoctorDashboardComponent } from '../auth/doctor-dashboard/doctor-dashboard.component';
import { DoctorRoutingModule } from './doctors-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DoctorDashboardComponent,
    DoctorAppointmentsComponent,
    PrescriptionCreateComponent,
    PrescriptionViewComponent,
    PrescribedMedicineComponent,
    PrescribedLabtestComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class DoctorModule { }
