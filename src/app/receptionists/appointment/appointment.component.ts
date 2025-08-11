import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReceptionistService } from 'src/app/shared/Service/receptionist.service';
import { Appointment } from 'src/app/shared/model/receptionist/appointment';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { Doctor } from 'src/app/shared/model/admin/doctor';

interface Department {
  departmentId: number;
  departmentName: string;
}



@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  registerNumber = '';
  searchedPatients: Patient[] = [];
  selectedPatient: Patient | null = null;

  departments: Department[] = [];
  doctors: Doctor[] = [];
  selectedDepartmentId: number | null = null;

  appointments: Appointment[] = [];

  newAppointment: Appointment = {
    patientId: 0,
    doctorId: 0,
    appointmentDate: new Date(),
    appointmentTime: '',
    receptionistId: 1, // example receptionistId
    tokenNumber: 0
  };

  availableTimes: string[] = [];

  todayString: string = ''; // format 'yyyy-MM-dd' for date input

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isEditMode = false;
  editAppointmentId: number | null = null;

  showBill = false;
  billData: any;

  constructor(
    private appointmentService: ReceptionistService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.setTodayDate();
    this.generateAvailableTimes();
  }

  loadDepartments() {
    this.appointmentService.getDepartments().subscribe({
      next: (depts) => {
        console.log("depts", depts);
        
        this.departments = depts},
      error: () => this.errorMessage = 'Failed to load departments.'
    });
  }

  onDepartmentChange() {
    this.doctors = [];
    this.newAppointment.doctorId = 0;
    if (this.selectedDepartmentId) {
      this.appointmentService.getDoctorsByDepartment(this.selectedDepartmentId).subscribe({
        next: (docs) => this.doctors = docs,
        error: () => this.errorMessage = 'Failed to load doctors for selected department.'
      });
    }
  }

  setTodayDate() {
    const today = new Date();
    this.todayString = today.toISOString().split('T')[0];
    this.newAppointment.appointmentDate = today;
  }

  generateAvailableTimes() {
    // Times from 9:00 to 17:00 every 30 mins
    const times: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    this.availableTimes = times;
  }

  isTimeSlotBooked(time: string): boolean {
    if (!this.newAppointment.doctorId) return false;

    // Exclude past times if appointment date is today
    if (this.todayString === this.newAppointment.appointmentDate!.toISOString().split('T')[0]) {
      const now = new Date();
      const [hourStr, minStr] = time.split(':');
      if (this.newAppointment.appointmentDate) {
        const slotDate = new Date(this.newAppointment.appointmentDate);
        slotDate.setHours(parseInt(hourStr, 10), parseInt(minStr, 10), 0, 0);
        if (slotDate <= now) {
          return true; // disable past times
        }
      }
    }

    // Check if any appointment for this doctor/time/date already exists (excluding the one being edited)
    return this.appointments.some(appt =>
      appt.doctorId === this.newAppointment.doctorId &&
      appt.appointmentDate!.toISOString().split('T')[0] === this.todayString &&
      appt.appointmentTime === time &&
      appt.appointmentId !== this.newAppointment.appointmentId
    );
  }

  searchPatients() {
    if (!this.registerNumber.trim()) {
      this.errorMessage = 'Please enter a register number to search.';
      this.searchedPatients = [];
      return;
    }
    this.errorMessage = '';
    this.appointmentService.searchPatientsByRegisterNumber(this.registerNumber.trim()).subscribe({
      next: patients => {
        this.searchedPatients = patients;
        if (patients.length === 0) {
          this.errorMessage = 'No patients found with this register number.';
        }
      },
      error: () => {
        this.errorMessage = 'Error searching patients.';
      }
    });
  }

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.newAppointment.patientId = patient.patientId;
    this.loadAppointments(patient.patientId);
    this.resetAppointmentForm();
  }

  loadAppointments(patientId: number) {
    this.isLoading = true;
    this.appointmentService.getAppointmentsByPatientId(patientId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load appointments.';
        this.isLoading = false;
      }
    });
  }

  scheduleAppointment() {
  // Validate required fields
  if (
    !this.newAppointment.doctorId ||
    !this.newAppointment.appointmentDate ||
    !this.newAppointment.appointmentTime
  ) {
    this.errorMessage = 'Please fill all appointment fields.';
    return;
  }
  this.errorMessage = '';

  // Ensure doctorId is a number
  this.newAppointment.doctorId = Number(this.newAppointment.doctorId);

  // Defensive: Ensure appointments is an array before checking time slot
  if (!Array.isArray(this.appointments)) {
    this.appointments = [];
  }

  // Check if time slot is already booked for the selected doctor
  if (this.isTimeSlotBooked(this.newAppointment.appointmentTime)) {
    this.errorMessage = 'This time slot is already booked for the selected doctor.';
    return;
  }

  // Defensive null check before date operations
  if (!this.newAppointment.appointmentDate) {
    this.errorMessage = 'Invalid appointment date.';
    return;
  }

  const newDate = new Date(this.newAppointment.appointmentDate);

  // Filter appointments for the same doctor and day
  const sameDayAppointments = this.appointments.filter(appt => {
    if (!appt.appointmentDate) return false;

    const apptDate = new Date(appt.appointmentDate);

    // Match same doctor and same date (ignore time part)
    return (
      appt.doctorId === this.newAppointment.doctorId &&
      apptDate.toDateString() === newDate.toDateString()
    );
  });

  // Max 30 tokens per doctor per day
  if (sameDayAppointments.length >= 30) {
    this.errorMessage = 'Maximum token limit (30) reached for this doctor on the selected day.';
    return;
  }

  // Assign token number
  this.newAppointment.tokenNumber = sameDayAppointments.length + 1;

  // Create appointmentNumber e.g. APT20250811-01
  const y = newDate.getFullYear();
  const m = String(newDate.getMonth() + 1).padStart(2, '0');
  const d = String(newDate.getDate()).padStart(2, '0');
  const tokenStr = String(this.newAppointment.tokenNumber).padStart(2, '0');
  this.newAppointment.appointmentNumber = `APT${y}${m}${d}-${tokenStr}`;

  this.newAppointment.isConsulted = false;

  if (this.isEditMode && this.editAppointmentId !== null) {
    this.newAppointment.appointmentId = this.editAppointmentId;
    this.appointmentService.editAppointment(this.newAppointment).subscribe({
      next: () => {
        this.successMessage = 'Appointment updated successfully!';
        this.showBillPrompt();
        this.loadAppointments(this.newAppointment.patientId);
        this.resetAppointmentForm();
      },
      error: () => {
        this.errorMessage = 'Failed to update appointment.';
      }
    });
  } else {
    console.log("Sending appointment data:", this.newAppointment);
    this.appointmentService.scheduleAppointment(this.newAppointment).subscribe({
      next: () => {
        this.successMessage = 'Appointment scheduled successfully!';
        this.showBillPrompt();
        this.loadAppointments(this.newAppointment.patientId);
        this.resetAppointmentForm();
      },
      error: () => {
        this.errorMessage = 'Failed to schedule appointment.';
      }
    });
  }
}


  editAppointment(appt: Appointment) {
    this.isEditMode = true;
    this.editAppointmentId = appt.appointmentId || null;
    this.newAppointment = { ...appt };
    this.selectedDepartmentId = this.getDepartmentIdByDoctorId(appt.doctorId);
    if (this.selectedDepartmentId) {
      this.onDepartmentChange(); // load doctors list
    }
  }

  isDoctorSelected(): boolean {
    return !!this.newAppointment.doctorId && this.newAppointment.doctorId !== 0;
  }

  isTimeSelected(): boolean {
    return !!this.newAppointment.appointmentTime && this.newAppointment.appointmentTime.trim() !== '';
  }
  deleteAppointment(id: number) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.successMessage = 'Appointment deleted successfully!';
        if (this.selectedPatient) {
          this.loadAppointments(this.selectedPatient.patientId);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to delete appointment.';
      }
    });
  }

  getDepartmentIdByDoctorId(doctorId: number): number | null {
    const doc = this.doctors.find(d => d.doctorId === doctorId);
    return doc ? doc.departmentId : null;
  }
   getDepartments(): void {
    this.appointmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        console.error('Failed to fetch departments', err);
      }
    });
  }

  showBillPrompt() {
    if (confirm('Do you want to generate bill now?')) {
      this.generateBill();
    } else {
      this.goToPatientSearch();
    }
  }

  generateBill() {
    this.appointmentService.generateBillForPatient(this.newAppointment.patientId).subscribe({
      next: bill => {
        this.billData = bill;
        this.showBill = true;
      },
      error: () => {
        this.errorMessage = 'Failed to generate bill.';
        this.showBill = false;
      }
    });
  }

  printBill() {
    alert('Printing bill as PDF... implement PDF generation here.');
    this.goToPatientSearch();
  }

  cancelPrint() {
    this.goToPatientSearch();
  }

  goToPatientSearch() {
    this.showBill = false;
    this.selectedPatient = null;
    this.registerNumber = '';
    this.searchedPatients = [];
    this.appointments = [];
    this.successMessage = '';
    this.errorMessage = '';
    this.resetAppointmentForm();
  }

  resetAppointmentForm() {
    this.isEditMode = false;
    this.editAppointmentId = null;
    this.newAppointment = {
      patientId: this.selectedPatient ? this.selectedPatient.patientId : 0,
      doctorId: 0,
      appointmentDate: new Date(),
      appointmentTime: '',
      receptionistId: 1,
      tokenNumber: 0
    };
    this.selectedDepartmentId = null;
  }
}
