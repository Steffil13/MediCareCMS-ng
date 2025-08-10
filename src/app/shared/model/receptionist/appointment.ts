export class Appointment {
  appointmentId?: number;
  patientId!: number;
  doctorId!: number;
  appointmentNumber?: string;
  patientName?: string;
  appointmentDate!: Date;
  appointmentTime!: string;
  tokenNumber!: number;
  isConsulted?: boolean;
  createdDate?: Date;
  receptionistId!: number;
  notes?: string;
}
