import { NgModule } from '@angular/core';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admins/admin.component';

const routes: Routes = [
  { path: 'labtest-view', component: LabtestViewComponent },
  // for admin dashbord list of all staff
  {path:'admin', loadChildren :() => 
    import('./admins/admins.module')
    .then (em => em.AdminsModule)
  },

  {path:'auth', loadChildren :() => 
    import('./auth/auth.module')
    .then (em => em.AuthModule)
  }

  // add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }