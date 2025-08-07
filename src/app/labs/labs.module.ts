import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabsRoutingModule } from './labs-routing.module';
import { LabsComponent } from './labs.component';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';
import { AddLabtestComponent } from './add-labtest/add-labtest.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateTestResultComponent } from './update-lab-result/update-lab-result.component';



@NgModule({
  declarations: [
    LabsComponent,
    LabtestViewComponent,
    AddLabtestComponent,
    TestResultsComponent,
    UpdateTestResultComponent,
  
  ],
  imports: [
    CommonModule,
    LabsRoutingModule,
    ReactiveFormsModule  
  ]
})
export class LabsModule { }
