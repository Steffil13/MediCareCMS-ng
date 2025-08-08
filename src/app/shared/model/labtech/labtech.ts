export class Labtech {
}
export interface TestResult {
  
registerNumber: number;
  resultValue: string;
  resultStatus: boolean;
  remarks: string;
  recordDate: string;
  date: string;
  plabTestId: number;
  patientName: string;
  labName: string;
  status: string; // e.g., 'Pending' or 'Completed'
}

export interface UpdateTestResultViewModel {
  resultValue: string;
  resultStatus: boolean;
  remarks: string;
}

export interface UpdateTestResult {
  resultValue: string;
  resultStatus: boolean;
  remarks: string;
  recordDate: Date;
}

export interface LabBillViewModel {
  labBillId?: number;          // optional, usually returned from backend
  patientId: number;
  prescriptionId: number;
  doctorId: number;
  labTechnicianId: number;
  totalAmount?: number;        // optional if calculated on backend
  billDate?: string;           // optional, ISO string date from backend
  paymentStatus?: string;      // e.g., "Paid", "Pending"
  remarks?: string;
}

