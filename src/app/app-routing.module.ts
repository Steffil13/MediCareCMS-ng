import { NgModule } from '@angular/core';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { AddLabtestComponent } from './labs/add-labtest/add-labtest.component';
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';
import { TestResultsComponent } from './labs/test-results/test-results.component';
import { LabBillComponent } from './labs/lab-bill/lab-bill.component';
import { UpdateTestResultComponent } from './labs/update-lab-result/update-lab-result.component';
import { LabBillComponent } from './labs/lab-bill/lab-bill.component';
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

  //{ path: '', redirectTo: '/labdashboard', pathMatch: 'full' }

  //{ path: 'pharmacist', component: PharmacistComponent },
  //Employees Route-- redirect to Login
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
  // {
  //   path: 'doctor',
  //   loadChildren: () => import('./doctors/doctors.module').then(m => m.DoctorModule),
  //   canActivate: [AuthGuard]
  // },
   //wildcard Route --NotFound
   { path: '**', redirectTo: 'auth/notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
