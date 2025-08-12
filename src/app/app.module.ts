import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrescriptionCreateComponent } from './doctors/prescription-create/prescription-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';
import { BillViewComponent } from './pharmacists/bill-view/bill-view.component';
import { CommonModule } from '@angular/common';
import { PrescribedMedicinesListComponent } from './pharmacists/prescribed-medicines-list/prescribed-medicines-list.component';
import { MedicineAssignComponent } from './pharmacists/medicine-assign/medicine-assign.component';
import { MedicineAddComponent } from './pharmacists/medicine-add/medicine-add.component';
import { MedicineListComponent } from './pharmacists/medicine-list/medicine-list.component';
import { PatientHistoryComponent } from './pharmacists/patient-history/patient-history.component';
import { BillHistoryComponent } from './pharmacists/bill-history/bill-history.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/nav/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LabDashboardComponent,
    PrescriptionCreateComponent,
    PrescribedMedicinesListComponent,
    BillViewComponent,
    MedicineAssignComponent,
    MedicineAddComponent,
    MedicineListComponent,
    PatientHistoryComponent,
    BillHistoryComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    
    CommonModule,
    AuthModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule, // ✅ Required for Toastr
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    RouterModule.forRoot([]), // keep your routes here
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
