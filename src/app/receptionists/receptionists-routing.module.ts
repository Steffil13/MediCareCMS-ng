import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistDashboardComponent } from '../auth/receptionist-dashboard/receptionist-dashboard.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { PatientComponent } from './patient/patient.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { BillComponent } from './bill/bill.component';

const routes: Routes = [
  { path: 'patient', loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule) }, 
  { path: 'appointment', loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule) }, 
  { path: 'bill', loadChildren: () => import('./bill/bill.module').then(m => m.BillModule) },
  {
    path: '',
    component: ReceptionistDashboardComponent,
    children: [
      { path: 'patients', component: PatientComponent },
      { path: 'patients/add', component: AddPatientComponent },
      { path: 'patients/edit/:id', component: EditPatientComponent },
      { path: 'billing', component: BillComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionistsRoutingModule { }
