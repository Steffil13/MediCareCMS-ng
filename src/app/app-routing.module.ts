import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';

const routes: Routes = [
  { path: 'labtest-view', component: LabtestViewComponent },
  // add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }