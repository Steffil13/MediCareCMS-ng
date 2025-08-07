import { Component, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/shared/Service/doctor.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class DoctorAppointmentsComponent implements OnInit {

  doctorId: number = 8; // Fetch from login or storage
  appointments: any[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    // this.doctorId = Number(localStorage.getItem('doctorId'));
    // console.log(this.doctorId);
    
    this.loadAppointments();
  }

  loadAppointments(): void {
    console.log(this.doctorId);
    console.log("res", this.appointments);
    
    this.doctorService.getAppointmentsByDoctorId().subscribe({
      next: (data) => this.appointments = data,
      error: (err) => console.error('Error fetching appointments', err)
    });
  }
}
