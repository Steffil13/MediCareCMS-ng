export interface LabBillViewModel {
  prescriptionId: number;
  labTechnicianId: number;
  patientId: number;
  doctorId: number;
  totalAmount: number;
}

export interface LabBill {
  labBillNumber: string;
  prescriptionId: number;
  labTechnicianId: number;
  patientId: number;
  doctorId: number;
  totalAmount: number;
  issuedDate: string;
  isPaid: boolean;
}

export interface LabInventory {
  labId: number;
  labName?: string;
  normalRange?: string;
  price?: number;
  availability?: boolean;
}