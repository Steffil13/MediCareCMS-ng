import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DoctorAppointmentsComponent } from '../doctors/appointments/appointments.component';
import { PrescriptionCreateComponent } from '../doctors/prescription-create/prescription-create.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashborad/admin-dashborad.component';
import { ReceptionistDashboardComponent } from './receptionist-dashboard/receptionist-dashboard.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminDashboardComponent },
  {path: 'doctor', component:DoctorDashboardComponent, canActivate:[AuthGuard], data:{role: '5'}},
  //{path: 'appointments', component: DoctorAppointmentsComponent },
  {path: 'appointments/:doctorId', component: DoctorAppointmentsComponent},
  {path: 'consult-prescription/:appointmentId', component: PrescriptionCreateComponent},
  //{path: 'notfound', component: NotfoundComponent}
  {
    path: 'receptionist',
    children: [
      { path: '', component: ReceptionistDashboardComponent },
      { path: 'patients', loadChildren: () => import('../receptionists/patient/patient.module').then(m => m.PatientModule) },
      { path: 'appointments', loadChildren: () => import('../receptionists/appointment/appointment.module').then(m => m.AppointmentModule) },
      { path: 'billing', loadChildren: () => import('../receptionists/bill/bill.module').then(m => m.BillModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
