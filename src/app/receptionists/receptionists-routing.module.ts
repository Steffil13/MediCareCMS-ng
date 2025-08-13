import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionistDashboardComponent } from '../auth/receptionist-dashboard/receptionist-dashboard.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { EditPatientComponent } from './patient/edit-patient/edit-patient.component';
import { PatientComponent } from './patient/patient.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { BillComponent } from './bill/bill.component';

const routes: Routes = [
  // { path: 'patient', component: PatientComponent }, 
  // { path: 'appointment', component: AppointmentComponent }, 
  // { path: 'bill', component: BillComponent},
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
