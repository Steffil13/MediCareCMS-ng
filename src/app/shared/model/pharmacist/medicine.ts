export class Medicine {
  medicineName: string = "";
  quantity: number = 0;
  price: number = 0;
  manufactureDate: string = "";  // ISO date string
  expiryDate: string = "";       // ISO date string
  availability: boolean = false;
}

export interface PharmacyBill {
  pharmacyBillId: number;
  patientName: string;
  doctorName: string;
  totalAmount: number;
  issuedDate: string; // ISO format date
  isIssued: boolean;
}
