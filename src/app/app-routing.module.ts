import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';
import { AddLabtestComponent } from './labs/add-labtest/add-labtest.component'; // ✅ Import
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';
import { TestResultsComponent } from './labs/test-results/test-results.component';
import { LabBillComponent } from './labs/lab-bill/lab-bill.component';
import { UpdateTestResultComponent } from './labs/update-lab-result/update-lab-result.component';

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

  { path: '', redirectTo: '/labdashboard', pathMatch: 'full' } 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
