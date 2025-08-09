import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAddComponent } from './admin-add/admin-add.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDashboardComponent } from '../auth/admin-dashborad/admin-dashborad.component';


const routes: Routes = [
  //list
   { path: '', component: AdminDashboardComponent },
  { path: 'list/:role', component: AdminListComponent },
  //add
  {path:'add/:role',component:AdminAddComponent},
  //edit
  {path:'edit/:id',component:AdminEditComponent},
  //
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
