import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent}
  // {path: 'admin', component:AdmindashboardComponent, canActivate:[AuthGuard], data:{role: '1'}},
  // {path: 'manager', component: ManagerdashboardComponent, canActivate:[AuthGuard], data:{role: '2'}},
  // {path: 'notfound', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
