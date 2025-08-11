import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddPatientComponent,
    EditPatientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule
  ]
})
export class PatientModule { }
