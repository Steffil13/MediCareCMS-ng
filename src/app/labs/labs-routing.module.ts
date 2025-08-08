import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';
import { AddLabtestComponent } from './add-labtest/add-labtest.component';
import { LabDashboardComponent } from '../auth/lab-dashboard/lab-dashboard.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { UpdateTestResultComponent } from './update-lab-result/update-lab-result.component';

const routes: Routes = [
 { path: 'labtests', component: LabtestViewComponent },
  { path: 'addlabtest', component: AddLabtestComponent },   
  { path: 'labdashboard', component: LabDashboardComponent },
  { path: 'testresults', component: TestResultsComponent },
  { path: 'update-result', component: UpdateTestResultComponent }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabsRoutingModule { }
