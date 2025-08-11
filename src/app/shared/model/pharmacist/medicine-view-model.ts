export class MedicineViewModel {
  medicineId: number = 0;
  medicineName: string = "";
  quantity: number = 0;
  price: number = 0;
  manufactureDate: string = "";  // or Date, depending on backend serialization
  expiryDate: string = "";       // or Date
  availability: boolean = false;
}
