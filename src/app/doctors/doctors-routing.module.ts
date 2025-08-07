import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorAppointmentsComponent } from './appointments/appointments.component';
import { PrescriptionCreateComponent } from './prescription-create/prescription-create.component';
import { PrescriptionViewComponent } from './prescription-view/prescription-view.component';
import { DoctorDashboardComponent } from '../auth/doctor-dashboard/doctor-dashboard.component';

const routes: Routes = [
  { path: 'doctor', component: DoctorDashboardComponent },
  { path: 'appointments', component: DoctorAppointmentsComponent },
  { path: 'create-prescription/:appointmentId', component: PrescriptionCreateComponent },
  { path: 'view-prescription/:appointmentId', component: PrescriptionViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
