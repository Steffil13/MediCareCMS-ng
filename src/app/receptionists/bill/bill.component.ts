import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import jsPDF from 'jspdf';

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
        next: () => {
          alert('Bill generated successfully!');
          this.downloadBillPdf(billData);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to generate bill.';
        }
      });
  }

  downloadBillPdf(billData: any) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Clinic Billing Receipt', 20, 20);

    doc.setFontSize(12);
    doc.text(`Bill Number: ${billData.billNumber}`, 20, 40);
    doc.text(`Appointment ID: ${billData.appointmentId}`, 20, 50);
    doc.text(`Patient ID: ${billData.patientId}`, 20, 60);
    doc.text(`Doctor ID: ${billData.doctorId}`, 20, 70);
    doc.text(`Receptionist ID: ${billData.receptionistId}`, 20, 80);
    doc.text(`Amount: ₹${this.calculateAmount(this.appointmentDetails)}`, 20, 90);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 100);

    doc.save(`${billData.billNumber}.pdf`);
  }

  calculateAmount(details: any) {
    return 500; // static for now, change if needed
  }
}
