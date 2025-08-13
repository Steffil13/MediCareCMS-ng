import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashborad/admin-dashborad.component';
import { ReceptionistDashboardComponent } from './receptionist-dashboard/receptionist-dashboard.component';
import { PharmacistDashboardComponent } from './pharmacist-dashboard/pharmacist-dashboard.component';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';

import { AuthGuard } from '../shared/guards/auth.guard';
import { DoctorAppointmentsComponent } from '../doctors/appointments/appointments.component';
import { PrescriptionCreateComponent } from '../doctors/prescription-create/prescription-create.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Admin dashboard with role '1'
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { role: '1' } },

  // Receptionist dashboard & child routes with role '2'
  {
    path: 'receptionist',
    canActivate: [AuthGuard],
    data: { role: '2' },
    children: [
      { path: '', component: ReceptionistDashboardComponent },
      { path: 'patients', loadChildren: () => import('../receptionists/patient/patient.module').then(m => m.PatientModule) },
      { path: 'appointments', loadChildren: () => import('../receptionists/appointment/appointment.module').then(m => m.AppointmentModule) },
      { path: 'billing', loadChildren: () => import('../receptionists/bill/bill.module').then(m => m.BillModule) },
    ]
  },

  // Pharmacist dashboard with role '3'
  { path: 'pharmacistdashboard', component: PharmacistDashboardComponent, canActivate: [AuthGuard], data: { role: '3' } },

  // Lab dashboard with role '4'
  { path: 'labdashboard', component: LabDashboardComponent, canActivate: [AuthGuard], data: { role: '4' } },

  // Doctor dashboard with role '5'
  { path: 'doctor', component: DoctorDashboardComponent, canActivate: [AuthGuard], data: { role: '5' } },

  // Doctor appointments and prescription routes (adjust guard if needed)
  { path: 'appointments/:doctorId', component: DoctorAppointmentsComponent },
  { path: 'consult-prescription/:appointmentId', component: PrescriptionCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
