import { Component, OnInit } from '@angular/core';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { Department } from 'src/app/shared/model/admin/department';
import { Doctor } from 'src/app/shared/model/admin/doctor';
import { Appointment } from 'src/app/shared/model/receptionist/appointment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  selectedDepartmentId: number | null = null;

  doctors: Doctor[] = [];
  newAppointment: Appointment = this.getEmptyAppointment();
  appointments: Appointment[] = [];

  availableTimes: string[] = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30'
  ];

  todayString = new Date().toISOString().split('T')[0];
  

  isEditMode = false;
  editAppointmentId: number | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(
    private receptionistService: ReceptionistService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.resetAppointmentForm(); // initialize with today's date
  }

  /** Returns a fresh empty appointment object */
  private getEmptyAppointment(): Appointment {
    return {
      appointmentId: undefined,
      patientId: 0,
      doctorId: 0,
      appointmentDate: this.todayString, // default as string for HTML date input
      appointmentTime: '',
      tokenNumber: 0,
      appointmentNumber: '',
      receptionistId: 1
    };
  }

  /** Returns tomorrow's date in yyyy-MM-dd format */
  maxDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  /** Returns doctor name by ID */
  getDoctorNameById(id?: number): string {
    console.log("hello", this.todayString);
    
    if (!id) return 'Unknown Doctor';
    const doctor = this.doctors.find(d => d.doctorId === id);
    return doctor ? doctor.doctorName : 'Unknown Doctor';
  }

  /** Loads department list */
  loadDepartments() {
    this.receptionistService.getDepartments().subscribe(data => this.departments = data);
  }

  /** Loads doctors for the selected department */
  loadDoctors(departmentId?: number) {
    const deptId = departmentId ?? this.selectedDepartmentId;
    if (!deptId) {
      this.doctors = [];
      return;
    }
    this.receptionistService.getDoctorsByDepartment(deptId)
      .subscribe(data => this.doctors = data);
  }

  /** Searches patients by register number */
  searchPatients() {
    if (!this.registerNumber.trim()) {
      this.errorMessage = 'Please enter a register number.';
      return;
    }
    this.errorMessage = '';

    this.receptionistService.searchPatientsByRegisterNumber(this.registerNumber)
      .subscribe({
        next: data => {
          this.searchedPatients = data;
          if (!this.searchedPatients.length) {
            this.errorMessage = 'No patients found.';
          }
        },
        error: () => {
          this.errorMessage = 'Error searching patients.';
        }
      });
  }

  /** Selects a patient from search results */
  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.searchedPatients = [];
    this.resetAppointmentForm();
    this.loadAppointments();
  }

  /** On department change, load doctors */
  onDepartmentChange() {
    if (this.selectedDepartmentId) {
      this.loadDoctors(this.selectedDepartmentId);
    }
  }

  /** Loads appointments for selected patient */
  loadAppointments() {
    if (!this.selectedPatient) return;
    this.receptionistService.getAppointmentsByPatientId(this.selectedPatient.patientId)
      .subscribe((data: any) => {
        this.appointments = Array.isArray(data) ? data : (data?.appointments || []);
      });
  }

  /** Checks if the time slot is already booked */
  isTimeSlotBooked(time: string): boolean {
    if (!this.newAppointment.appointmentDate || !this.newAppointment.doctorId) return false;

    const dateStr = typeof this.newAppointment.appointmentDate === 'string'
      ? this.newAppointment.appointmentDate
      : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

    return Array.isArray(this.appointments) && this.appointments.some(appt =>
      appt.doctorId === this.newAppointment.doctorId &&
      new Date(appt.appointmentDate as Date).toISOString().split('T')[0] === dateStr &&
      appt.appointmentTime === time
    );
  }

  /** Schedules or edits an appointment */
 scheduleAppointment() {
  if (!this.selectedPatient) {
    this.errorMessage = 'Please select a patient first.';
    return;
  }
  if (!this.newAppointment.doctorId || !this.newAppointment.appointmentDate || !this.newAppointment.appointmentTime) {
    this.errorMessage = 'Please fill all appointment fields.';
    return;
  }

  this.newAppointment.doctorId = Number(this.newAppointment.doctorId);

  // Simple token increment logic:
  // Count how many appointments are already loaded for this doctor on selected date
  const dateStr = typeof this.newAppointment.appointmentDate === 'string'
    ? this.newAppointment.appointmentDate
    : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

  const currentTokens = this.appointments.filter(appt =>
  appt.doctorId === this.newAppointment.doctorId &&
  appt.appointmentDate != null && // <-- check not null
  (new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr)
).length;
console.log("ct", currentTokens);


  // Assign next token number
  this.newAppointment.tokenNumber = currentTokens + 1;
  console.log("dddd", this.newAppointment.tokenNumber)

  // Generate Appointment Number: APT + 4 digit random number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  this.newAppointment.appointmentNumber = `APT${randomNum}`;

  // Convert to ISO datetime (include appointment time)
  const dateObj = new Date(this.newAppointment.appointmentDate);
  const [hours, minutes] = this.newAppointment.appointmentTime.split(':').map(Number);
  dateObj.setHours(hours, minutes, 0, 0);
  this.newAppointment.appointmentDate = dateObj.toISOString();

  const payload: Appointment = {
    ...this.newAppointment,
    patientId: this.selectedPatient.patientId
  };

  if (this.isEditMode && this.editAppointmentId) {
    payload.appointmentId = this.editAppointmentId;
    this.receptionistService.editAppointment(payload).subscribe({
      next: () => {
        this.successMessage = 'Appointment updated successfully!';
        this.loadAppointments();
        this.resetAppointmentForm();
      },
      error: () => this.errorMessage = 'Failed to update appointment.'
    });
  } else {
    this.receptionistService.scheduleAppointment(payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Appointment scheduled successfully!';
        this.loadAppointments();
        this.resetAppointmentForm();

        // Show toastr with generate bill option
        const apptId = res?.appointmentId || payload.appointmentId;

        this.toastr.info('Appointment scheduled! Click here to generate bill.', 'Info', {
          timeOut: 8000,
          closeButton: true,
          tapToDismiss: false,
          extendedTimeOut: 0,
          onActivateTick: true
        }).onTap.subscribe(() => {
          this.router.navigate(['/billing'], { queryParams: { appointmentId: apptId } });
        });

      },
      error: () => this.errorMessage = 'Failed to schedule appointment.'
    });
  }
}


  /** Enables edit mode for an appointment */
  editAppointment(appt: Appointment) {
    this.isEditMode = true;
    this.editAppointmentId = appt.appointmentId || null;
    this.newAppointment = { ...appt };
  }

  /** Deletes an appointment by ID */
  deleteAppointment(id: number) {
    this.receptionistService.deleteAppointment(id).subscribe({
      next: () => {
        this.successMessage = 'Appointment deleted successfully!';
        this.loadAppointments();
      },
      error: () => this.errorMessage = 'Failed to delete appointment.'
    });
  }

  /** Resets the appointment form to defaults */
  resetAppointmentForm() {
    this.newAppointment = this.getEmptyAppointment();
    this.isEditMode = false;
    this.editAppointmentId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
