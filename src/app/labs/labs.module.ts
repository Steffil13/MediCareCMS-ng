import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabsRoutingModule } from './labs-routing.module';
import { LabsComponent } from './labs.component';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';
import { AddLabtestComponent } from './add-labtest/add-labtest.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabBillComponent } from './lab-bill/lab-bill.component';
import { UpdateTestResultComponent } from './update-lab-result/update-lab-result.component';
import { SharedModule } from '../shared/nav/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    LabsComponent,
    LabtestViewComponent,
    AddLabtestComponent,
    TestResultsComponent,
    UpdateTestResultComponent,
    LabBillComponent,
  
  ],
  imports: [
    CommonModule,
    LabsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class LabsModule { }
