export class PharmacyBillViewModel {
  prescriptionId: number;
  pmedicineId: number;
  pharmacistId: number;
  pharmacyBillId: string;
  doctorName: string;
  patientName: string;
  medicines: string[];
  totalAmount: number;
  issuedDate: Date | null;

  constructor(
    prescriptionId: number = 0,
    pmedicineId: number = 0,
    pharmacistId: number = 0,
    totalAmount: number = 0,
    pharmacyBillId: string = '',
    doctorName: string = '',
    patientName: string = '',
    medicines: string[] = [],
    issuedDate: Date | null = null
  ) {
    this.prescriptionId = prescriptionId;
    this.pmedicineId = pmedicineId;
    this.pharmacistId = pharmacistId;
    this.totalAmount = totalAmount;
    this.pharmacyBillId = pharmacyBillId;
    this.doctorName = doctorName;
    this.patientName = patientName;
    this.medicines = medicines;
    this.issuedDate = issuedDate;
  }
}

