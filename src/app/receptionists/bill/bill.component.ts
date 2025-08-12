import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Receptionist } from 'src/app/shared/model/admin/receptionist';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  appointmentId: string | null = null;
  appointmentDetails: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get appointmentId from query params
    this.route.queryParams.subscribe(params => {
      this.appointmentId = params['appointmentId'] || null;
      if (this.appointmentId) {
        this.fetchAppointmentDetails(this.appointmentId);
      } else {
        this.loading = false;
        this.errorMessage = 'No appointment selected.';
      }
    });
  }

  fetchAppointmentDetails(id: string) {
    this.http.get(`${environment.apiUrl}/receptionist/appointments/${id}`)
      .subscribe({
        next: (data) => {
          console.log("data", data);
          
          this.appointmentDetails = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching appointment', err);
          this.errorMessage = 'Failed to fetch appointment details.';
          this.loading = false;
        }
      });
  }

  generateBill() {
    if (!this.appointmentDetails) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const billNum = `BILL${randomNum}`;

    const billData = {
      appointmentId: this.appointmentId,
      patientId: this.appointmentDetails.patientId,
      doctorId: this.appointmentDetails.doctorId,
      billNumber: billNum,
      receptionistId: this.appointmentDetails.receptionistId
    };

    this.http.post(`${environment.apiUrl}/receptionist/billings`, billData)
      .subscribe({
        next: () => alert('Bill generated successfully!'),
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to generate bill.';
        }
      });
  }

  calculateAmount(details: any) {
    // Placeholder — you can adjust calculation logic
    return 500; 
  }
}
