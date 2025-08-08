import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DoctorAppointmentsComponent } from '../doctors/appointments/appointments.component';
import { PrescriptionCreateComponent } from '../doctors/prescription-create/prescription-create.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'doctor', component:DoctorDashboardComponent, canActivate:[AuthGuard], data:{role: '5'}},
  {path: 'appointments/:doctorId', component: DoctorAppointmentsComponent},
  {path: 'consult-prescription/:appointmentId', component: PrescriptionCreateComponent}
  //{path: 'notfound', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
