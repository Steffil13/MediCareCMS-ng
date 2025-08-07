import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmacistsRoutingModule } from './pharmacists-routing.module';
import { PharmacistComponent } from './pharmacist.component';


@NgModule({
  declarations: [
    PharmacistComponent
  ],
  imports: [
    CommonModule,
    PharmacistsRoutingModule
  ]
})
export class PharmacistsModule { }
