import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

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
    private http: HttpClient,
    private router: Router
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

  /** Fetch appointment & patient/doctor details */
  fetchAppointmentDetails(id: string) {
    this.http.get(`${environment.apiUrl}/receptionist/appointments/${id}`)
      .subscribe({
        next: (data: any) => {
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

  /** Generate bill in backend and download PDF */
  generateBill() {
    if (!this.appointmentDetails) return;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const billNum = `BILL${randomNum}`;

    const billData = {
      appointmentId: this.appointmentId,
      patientId: this.appointmentDetails.patient.patientId,
      doctorId: this.appointmentDetails.doctor.doctorId,
      billNumber: billNum,
      receptionistId: this.appointmentDetails.receptionistId
    };

    this.http.post(`${environment.apiUrl}/receptionist/billings`, billData)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Bill Generated',
            text: `Bill Number: ${billNum} has been successfully generated.`,
            confirmButtonText: 'Download PDF'
          }).then(() => {
            this.downloadBillPdf(billData);
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Failed to generate bill.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to generate bill. Please try again.'
          });
        }
      });
  }

  /** Download PDF bill with jsPDF */
  downloadBillPdf(billData: any) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('🏥 Clinic Billing Receipt', 20, 20);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Bill info
    doc.setFontSize(12);
    doc.text(`Bill Number: ${billData.billNumber}`, 20, 40);
    doc.text(`Appointment Number: ${this.appointmentDetails.appointmentNumber}`, 20, 50);

    // Patient info
    doc.text(`Patient: ${this.appointmentDetails.patient.firstName} ${this.appointmentDetails.patient.lastName}`, 20, 60);
    doc.text(`Register No: ${this.appointmentDetails.patient.registerNumber}`, 20, 70);

    // Doctor info
    doc.text(`Doctor: Dr. ${this.appointmentDetails.doctor.firstName} ${this.appointmentDetails.doctor.lastName}`, 20, 80);

    // Date & Time
    doc.text(`Appointment Date: ${new Date(this.appointmentDetails.appointmentDate).toLocaleDateString()}`, 20, 90);
    doc.text(`Appointment Time: ${this.appointmentDetails.appointmentTime}`, 20, 100);

    // Fee
    doc.text(`Amount: ₹${this.calculateAmount(this.appointmentDetails)}`, 20, 110);

    // Footer
    doc.setLineWidth(0.5);
    doc.line(20, 250, 190, 250);
    doc.text('Thank you for visiting!', 105, 260, { align: 'center' });

    doc.save(`${billData.billNumber}.pdf`);
  }

  /** Fee calculation: currently static */
  calculateAmount(details: any) {
    return details.doctor?.doctorFee || 500; // Use doctor's fee if available
  }

  /** Cancel and navigate back */
  cancelBill() {
    Swal.fire({
      title: 'Cancel Bill?',
      text: 'Are you sure you want to cancel and go back?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go back',
      cancelButtonText: 'Stay here'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/receptionist/appointments']); // Change path to your actual appointment route
      }
    });
  }
}
