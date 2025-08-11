export class PharmacyBillViewModel {
  prescriptionId: number;
  pmedicineId: number;
  pharmacistId: number;
  totalAmount: number;
  pharmacyBillId: string;

  constructor(
    prescriptionId: number = 0,
    pmedicineId: number = 0,
    pharmacistId: number = 0,
    totalAmount: number = 0,
    pharmacyBillId: string = ''
  ) {
    this.prescriptionId = prescriptionId;
    this.pmedicineId = pmedicineId;
    this.pharmacistId = pharmacistId;
    this.totalAmount = totalAmount;
    this.pharmacyBillId = pharmacyBillId;
  }
}