import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LabDashboardComponent } from './auth/lab-dashboard/lab-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LabDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
