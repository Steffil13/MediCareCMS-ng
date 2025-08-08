import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/shared/model/receptionist/appointment';
import { AuthService } from 'src/app/shared/Service/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {

  allAppointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  activeTab: 'all' | 'mine' = 'all';
  doctorId: number = 0;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.doctorId = Number(localStorage.getItem('DOC_ID'));
    console.log('Doctor ID:', this.doctorId);
    this.loadAppointments();
  }

  loadAppointments(): void {
    // this.http.get<any[]>(`https://your-api.com/api/appointments/doctor/${this.doctorId}`)
    //   .subscribe({
    //     next: (data) => {
    //       this.allAppointments = data;
    //     },
    //     error: (err) => {
    //       console.error('Failed to load appointments', err);
    //     }
    //   });
  }

  showAllAppointments(): void {
    this.router.navigate(['/appointments', this.doctorId]);
  }

  // showMySchedule(): void {
  //   this.activeTab = 'mine';
  //   this.filteredAppointments = this.allAppointments.filter(app => app.doctorId === this.doctorId);
  // }

  consultAppointment(appointmentId: number): void {
    this.router.navigate(['/doctor/prescribe', appointmentId]);
  }

}
