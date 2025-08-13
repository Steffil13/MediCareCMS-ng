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

  maxDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getDoctorNameById(id?: number): string {
    if (!id) return 'Unknown Doctor';
    const doctor = this.doctors.find(d => d.doctorId === id);
    return doctor ? doctor.doctorName : 'Unknown Doctor';
  }

  loadDepartments() {
    this.receptionistService.getDepartments()
      .subscribe(data => this.departments = data);
  }

  loadDoctors(departmentId?: number) {
    const deptId = departmentId ?? this.selectedDepartmentId;
    if (!deptId) {
      this.doctors = [];
      return;
    }
    this.receptionistService.getDoctorsByDepartment(deptId)
      .subscribe(data => this.doctors = data);
  }

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

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.searchedPatients = [];
    this.resetAppointmentForm();
    this.loadAppointments();
  }

  onDepartmentChange() {
    if (this.selectedDepartmentId) {
      this.loadDoctors(this.selectedDepartmentId);
    }
    this.newAppointment.doctorId = 0;
    this.newAppointment.appointmentTime = '';
  }

  onDoctorChange() {
    this.newAppointment.appointmentTime = '';
    this.loadAppointments(); // Refresh booked appointments for the selected patient + doctor + date
  }

  onDateChange() {
    this.newAppointment.appointmentTime = '';
    this.loadAppointments();
  }

  loadAppointments() {
    if (!this.selectedPatient) return;
    this.receptionistService.getAppointmentsByPatientId(this.selectedPatient.patientId)
      .subscribe((data: any) => {
        this.appointments = Array.isArray(data) ? data : (data?.appointments || []);
      });
  }

  isTimeSlotBooked(time: string): boolean {
    if (!this.newAppointment.appointmentDate || !this.newAppointment.doctorId) return false;

    const selectedDateStr = typeof this.newAppointment.appointmentDate === 'string'
      ? this.newAppointment.appointmentDate
      : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Disable past time slots if the selected date is today
    if (selectedDateStr === todayStr) {
      const [hour, minute] = time.split(':').map(Number);
      if (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())) {
        return true;
      }
    }

    // Disable if already booked for this doctor on this date (except if editing the same appointment)
    return this.appointments.some(appt =>
      appt.doctorId === this.newAppointment.doctorId &&
      appt.appointmentTime === time &&
      new Date(appt.appointmentDate as string).toISOString().split('T')[0] === selectedDateStr &&
      appt.appointmentId !== this.editAppointmentId
    );
  }

  scheduleAppointment() {
    if (!this.selectedPatient) {
      this.errorMessage = 'Please select a patient first.';
      return;
    }
    if (!this.newAppointment.doctorId || !this.newAppointment.appointmentDate || !this.newAppointment.appointmentTime) {
      this.errorMessage = 'Please fill all appointment fields.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.newAppointment.doctorId = Number(this.newAppointment.doctorId);

    const dateStr = typeof this.newAppointment.appointmentDate === 'string'
      ? this.newAppointment.appointmentDate
      : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

    // Calculate token number for the doctor on selected date
    const currentTokens = this.appointments.filter(appt =>
      appt.doctorId === this.newAppointment.doctorId &&
      appt.appointmentDate != null &&
      (new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr) &&
      (appt.appointmentId !== this.editAppointmentId)
    ).length;

    this.newAppointment.tokenNumber = currentTokens + 1;

    // Generate a random appointment number if new
    if (!this.isEditMode) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      this.newAppointment.appointmentNumber = `APT${randomNum}`;
    }

    // Prepare ISO datetime string for backend
    const dateObj = new Date(this.newAppointment.appointmentDate);
    console.log("dddd", dateObj);
    
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

  editAppointment(appt: Appointment) {
    this.isEditMode = true;
    this.editAppointmentId = appt.appointmentId || null;
    // Convert appointmentDate to ISO string date for date input compatibility
    let appointmentDateStr = appt.appointmentDate;
    if (appointmentDateStr) {
      appointmentDateStr = new Date(appointmentDateStr).toISOString().split('T')[0];
    }
    this.newAppointment = { ...appt, appointmentDate: appointmentDateStr };
  }

  deleteAppointment(id: number) {
    this.receptionistService.deleteAppointment(id).subscribe({
      next: () => {
        this.successMessage = 'Appointment deleted successfully!';
        this.loadAppointments();
      },
      error: () => this.errorMessage = 'Failed to delete appointment.'
    });
  }

  resetAppointmentForm() {
    this.newAppointment = this.getEmptyAppointment();
    this.isEditMode = false;
    this.editAppointmentId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
