import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Import this

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';
import { TestResultsComponent } from './labs/test-results/test-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LabDashboardComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
