import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/shared/service/doctor.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
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
    private router: Router
  ) { }

  ngOnInit() {
    const doctorId = this.route.snapshot.paramMap.get('doctorId'); // or use subscribe
    console.log('Doctor ID:', doctorId);

    if (doctorId) {
      this.loadAppointments(doctorId);
    }
  }

  loadAppointments(doctorId: string) {
    this.http.get<any[]>(`https://localhost:7288/api/doctor/appointments/${doctorId}`)
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
}

