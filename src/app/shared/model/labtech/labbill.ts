export interface LabBillViewModel {
  prescriptionId: number;
  labTechnicianId: number;
  patientId: number;
  doctorId: number;
  totalAmount: number;
}

export interface LabBill {
  labBillNumber: string;
  patientId: number;
  prescriptionId: number;
  doctorId: number;
  labTechnicianId: number;
  totalAmount: number;
  issuedDate: string;
  isPaid: boolean;
  labBillId: number; // Assuming your entity has an ID property
}

export interface LabInventory {
  labId: number;
  labName?: string;
  normalRange?: string;
  price?: number;
  availability?: boolean;
}

export class BillHistory {
  labBillId: number = 0;
  labBillNumber: string = "";
  patientName: string = "";
  doctorName: string = "";
  totalAmount: number = 0;
  issuedDate: string = ""; // ISO date string from API
  isPaid: boolean = false;
}
