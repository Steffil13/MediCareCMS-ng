import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptionistsRoutingModule } from './receptionists-routing.module';
import { ReceptionComponent } from './reception.component';


@NgModule({
  declarations: [
    ReceptionComponent
  ],
  imports: [
    CommonModule,
    ReceptionistsRoutingModule
  ]
})
export class ReceptionistsModule { }
