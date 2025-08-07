import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';

const routes: Routes = [
  { path: 'view', component: LabtestViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabsRoutingModule { }
