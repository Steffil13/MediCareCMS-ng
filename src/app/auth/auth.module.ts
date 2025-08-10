import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReceptionistDashboardComponent } from './receptionist-dashboard/receptionist-dashboard.component';
import { PharmacistDashboardComponent } from './pharmacist-dashboard/pharmacist-dashboard.component';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashborad/admin-dashborad.component';
import { SharedModule } from '../shared/nav/shared/shared.module';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    NotFoundComponent,
    ReceptionistDashboardComponent,
    PharmacistDashboardComponent,
    LabDashboardComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})

export class AuthModule { }
