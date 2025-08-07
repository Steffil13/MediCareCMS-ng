import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabsRoutingModule } from './labs-routing.module';
import { LabsComponent } from './labs.component';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';



@NgModule({
  declarations: [
    LabsComponent,
    LabtestViewComponent,
  
  ],
  imports: [
    CommonModule,
    LabsRoutingModule
  ]
})
export class LabsModule { }
