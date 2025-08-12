import { NgModule } from '@angular/core';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { AddLabtestComponent } from './labs/add-labtest/add-labtest.component';
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';
import { TestResultsComponent } from './labs/test-results/test-results.component';
import { UpdateTestResultComponent } from './labs/update-lab-result/update-lab-result.component';
import { LabBillComponent } from './labs/lab-bill/lab-bill.component';
import { MedicineAssignComponent } from './pharmacists/medicine-assign/medicine-assign.component';
import { BillViewComponent } from './pharmacists/bill-view/bill-view.component';
import { PharmacistDashboardComponent } from './auth/pharmacist-dashboard/pharmacist-dashboard.component';
import { PrescribedMedicinesListComponent } from './pharmacists/prescribed-medicines-list/prescribed-medicines-list.component';
import { MedicineAddComponent } from './pharmacists/medicine-add/medicine-add.component';
import { MedicineListComponent } from './pharmacists/medicine-list/medicine-list.component';
import { PatientHistoryComponent } from './pharmacists/patient-history/patient-history.component';
import { BillHistoryComponent } from './pharmacists/bill-history/bill-history.component';
import { BillComponent } from './receptionists/bill/bill.component';
//import { PharmacistComponent } from './pharmacists/pharmacist.component';

const routes: Routes = [
  {
    path: 'labs',
    loadChildren: () =>
      import('./labs/labs.module').then((m) => m.LabsModule)
  },

  { path: 'labtests', component: LabtestViewComponent },
  { path: 'addlabtest', component: AddLabtestComponent },   
  { path: 'labdashboard', component: LabDashboardComponent },
  { path: 'testresults', component: TestResultsComponent },
  { path: 'update-test-result/:plabTestId', component: UpdateTestResultComponent },
  { path: 'generate-labbill/:prescriptionId', component: LabBillComponent },
  { path: 'labtechnician/bill/:billId', component: LabBillComponent },

  //{ path: '', redirectTo: '/labdashboard', pathMatch: 'full' }

  //pharmacist routes
  { path: 'pharmacist', redirectTo: 'pharmacist/dashboard', pathMatch: 'full' },
  { path: 'pharmacistdashboard', component: PharmacistDashboardComponent },
  { path: 'pharmacist/prescribed-medicines', component: PrescribedMedicinesListComponent },
  { path: 'pharmacist/assign-medicine/:id', component: MedicineAssignComponent },
  { path: 'pharmacist/bill/:id', component: BillViewComponent },
  { path: 'pharmacist/add-medicine', component: MedicineAddComponent },
  { path: 'pharmacist/medicines', component: MedicineListComponent },
  { path: 'patient-history', component: PatientHistoryComponent },
  { path: 'pharmacist/bill-history', component: BillHistoryComponent },






  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  //parent : Lazy loading the employee module
  {
    path: 'admin', loadChildren: () =>
      import('./admins/admins.module')
        .then(em => em.AdminsModule)
  },
  { path: 'labtest-view', component: LabtestViewComponent },
  {
    path: 'auth', loadChildren: () =>
      import('./auth/auth.module')
        .then(em => em.AuthModule)
  },
  
   //wildcard Route --NotFound
   { path: '**', redirectTo: 'auth/notfound', pathMatch: 'full' },
   {
    path: 'billing',
    component: BillComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
