import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/nav/shared/shared.module';
import { DoctorService } from 'src/app/shared/service/doctor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class DoctorAppointmentsComponent implements OnInit {

  doctorId: number = 0; // Fetch from login or storage
  appointments: any[] = [];

  constructor(
    private route: ActivatedRoute, 
    private doctorService: DoctorService, 
    private http: HttpClient,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    const doctorId = Number(this.route.snapshot.paramMap.get('doctorId')); // or use subscribe
    console.log('Doctor ID:', doctorId);

    if (doctorId) {
      this.loadAppointments(doctorId);
    }
  }

  loadAppointments(doctorId: number) {
    this.http.get<any[]>(`https://localhost:7288/api/Doctor/appointments/${doctorId}`)
      .subscribe({
        next: (data) => {
          console.log('Appointments:', data);
          this.appointments = data;
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        }
      });
  }

  consultPatient(appt: any) {
    console.log("Consulting patient:", appt);
    // You can add navigation or API call here
    this.router.navigate(['/consult-prescription', appt.appointmentId]);
  }
   goBack(): void {
    this.location.back();
  }
}

