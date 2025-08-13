import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { AppointmentComponent } from './appointment.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/nav/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AppointmentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppointmentRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class AppointmentModule { }
