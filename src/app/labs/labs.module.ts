import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddLabtestComponent } from './add-labtest/add-labtest.component';
import { LabtestViewComponent } from './labtest-view/labtest-view.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { UpdateTestResultComponent } from './update-lab-result/update-lab-result.component';
import { LabBillComponent } from './lab-bill/lab-bill.component';
import { LabtestListComponent } from './lab-list/lab-list.component';
import { NaviComponent } from './navi/navi.component';



@NgModule({
  declarations: [
    AddLabtestComponent,
    LabtestViewComponent,
    TestResultsComponent,
    UpdateTestResultComponent,
    LabBillComponent,
    LabtestListComponent,
    NaviComponent
    
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class LabsModule { }
