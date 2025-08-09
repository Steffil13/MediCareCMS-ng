import { NgModule } from '@angular/core';
import { LabtestViewComponent } from './labs/labtest-view/labtest-view.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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