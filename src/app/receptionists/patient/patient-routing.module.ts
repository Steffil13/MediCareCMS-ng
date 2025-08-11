import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';

const routes: Routes = [
  { path: '', component: PatientComponent },
  { path: 'add', component: AddPatientComponent },
  // {path: 'add',
  //   loadComponent: () => import('./add-patient/add-patient.component').then(m => m.AddPatientComponent)},
  { path: 'edit/:id', component: EditPatientComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
