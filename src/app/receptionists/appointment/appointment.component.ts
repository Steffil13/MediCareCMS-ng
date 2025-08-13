import { Component, OnInit } from '@angular/core';
import { ReceptionistService } from 'src/app/shared/service/receptionist.service';
import { Patient } from 'src/app/shared/model/receptionist/patient';
import { Department } from 'src/app/shared/model/admin/department';
import { Doctor } from 'src/app/shared/model/admin/doctor';
import { Appointment } from 'src/app/shared/model/receptionist/appointment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.resetAppointmentForm();
  }

  private getEmptyAppointment(): Appointment {
    return {
      appointmentId: undefined,
      patientId: 0,
      doctorId: 0,
      appointmentDate: this.todayString,
      appointmentTime: '',
      tokenNumber: 0,
      appointmentNumber: '',
      receptionistId: 1
    };
  }

  loadDepartments() {
    this.receptionistService.getDepartments().subscribe(data => this.departments = data);
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
  }

  loadAppointments() {
    if (!this.selectedPatient) return;
    this.receptionistService.getAppointmentsByPatientId(this.selectedPatient.patientId)
      .subscribe((data: any) => {
        this.appointments = Array.isArray(data) ? data : (data?.appointments || []);
      });
  }

  /** Check if slot booked by doctor/date */
  isTimeSlotBooked(time: string): boolean {
    if (!this.newAppointment.appointmentDate || !this.newAppointment.doctorId) return false;

    const dateStr = typeof this.newAppointment.appointmentDate === 'string'
      ? this.newAppointment.appointmentDate
      : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

    return Array.isArray(this.appointments) && this.appointments.some(appt =>
      appt.doctorId === this.newAppointment.doctorId &&
      appt.appointmentDate != null &&
      new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr &&
      appt.appointmentTime.trim() === time.trim()
    );
  }

  /** Show only non-booked and future slots */
  shouldShowTimeSlot(time: string): boolean {
    if (this.isTimeSlotBooked(time)) return false;

    if (this.newAppointment.appointmentDate) {
      const selectedDateStr = typeof this.newAppointment.appointmentDate === 'string'
        ? this.newAppointment.appointmentDate
        : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];

      const todayStr = new Date().toISOString().split('T')[0];
      if (selectedDateStr === todayStr) {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= now) return false;
      }
    }
    return true;
  }

  /** Schedule appointment with patient/doctor conflict checks */
  scheduleAppointment() {
    if (!this.selectedPatient) {
      this.errorMessage = 'Please select a patient first.';
      return;
    }
    if (!this.newAppointment.doctorId || !this.newAppointment.appointmentDate || !this.newAppointment.appointmentTime) {
      this.errorMessage = 'Please fill all appointment fields.';
      return;
    }

    const selectedPatientId = this.selectedPatient.patientId;
    const selectedDoctorId = Number(this.newAppointment.doctorId);
    const dateStr = typeof this.newAppointment.appointmentDate === 'string'
      ? this.newAppointment.appointmentDate
      : new Date(this.newAppointment.appointmentDate).toISOString().split('T')[0];
    const appointmentTime = this.newAppointment.appointmentTime.trim();

    // conflict: patient same date/time with any doctor
    const patientConflict = this.appointments.some(appt =>
      appt.patientId === selectedPatientId &&
      appt.appointmentTime.trim() === appointmentTime &&
      appt.appointmentDate != null &&
      new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr &&
      (!this.isEditMode || appt.appointmentId !== this.editAppointmentId)
    );
    if (patientConflict) {
      this.errorMessage = 'This patient already has an appointment at the selected date and time.';
      return;
    }

    // conflict: doctor same date/time with any patient
    const doctorConflict = this.appointments.some(appt =>
      appt.doctorId === selectedDoctorId &&
      appt.appointmentTime.trim() === appointmentTime &&
      appt.appointmentDate != null &&
      new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr &&
      (!this.isEditMode || appt.appointmentId !== this.editAppointmentId)
    );
    if (doctorConflict) {
      this.errorMessage = 'The selected doctor already has an appointment at that date and time.';
      return;
    }

    // Assign token
    this.newAppointment.doctorId = selectedDoctorId;
    const currentTokens = this.appointments.filter(appt =>
      appt.doctorId === selectedDoctorId &&
      appt.appointmentDate != null &&
      new Date(appt.appointmentDate).toISOString().split('T')[0] === dateStr
    ).length;
    this.newAppointment.tokenNumber = currentTokens + 1;

    // Generate appointment number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.newAppointment.appointmentNumber = `APT${randomNum}`;

    // Set appointmentDate to ISO time including hours and minutes
    const dateObj = new Date(this.newAppointment.appointmentDate);
    const [hours, minutes] = this.newAppointment.appointmentTime.split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);
    this.newAppointment.appointmentDate = dateObj.toISOString();

    const payload: Appointment = {
      ...this.newAppointment,
      patientId: selectedPatientId
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
          Swal.fire({
            title: 'Appointment Scheduled!',
            text: 'Do you want to generate a bill for this appointment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Generate Bill',
            cancelButtonText: 'No'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/billing'], { queryParams: { appointmentId: apptId } });
            }
          });
        },
        error: () => this.errorMessage = 'Failed to schedule appointment.'
      });
    }
  }

  editAppointment(appt: Appointment) {
    this.isEditMode = true;
    this.editAppointmentId = appt.appointmentId || null;
    this.newAppointment = { ...appt };
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

  getDoctorNameById(id?: number): string {
    if (!id) return 'Unknown Doctor';
    const doctor = this.doctors.find(d => d.doctorId === id);
    return doctor ? doctor.doctorName : 'Unknown Doctor';
  }
}
