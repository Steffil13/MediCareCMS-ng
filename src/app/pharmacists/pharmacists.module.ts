import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmacistsRoutingModule } from './pharmacists-routing.module';
import { PharmacistComponent } from './pharmacist.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PharmacistComponent
  ],
  imports: [
    CommonModule,
    PharmacistsRoutingModule,
    FormsModule 
  ]
})
export class PharmacistsModule { }
