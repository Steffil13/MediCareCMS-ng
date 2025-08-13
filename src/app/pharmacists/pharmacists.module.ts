import { NgModule } from '@angular/core';


import { PharmacistsRoutingModule } from './pharmacists-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicineAssignComponent } from './medicine-assign/medicine-assign.component';
import { PharmacistDashboardComponent } from '../auth/pharmacist-dashboard/pharmacist-dashboard.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { PrescribedMedicinesListComponent } from './prescribed-medicines-list/prescribed-medicines-list.component';
import { MedicineAddComponent } from './medicine-add/medicine-add.component';
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { CommonModule } from '@angular/common';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { BillHistoryComponent } from './bill-history/bill-history.component';
import { NavComponent } from './nav/nav.component';


@NgModule({
  declarations: [
    PharmacistDashboardComponent,
    MedicineAssignComponent,
    BillViewComponent, 
    PrescribedMedicinesListComponent, 
    MedicineAddComponent, 
    MedicineListComponent,
    PatientHistoryComponent,
    BillHistoryComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    PharmacistsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PharmacistsModule { }