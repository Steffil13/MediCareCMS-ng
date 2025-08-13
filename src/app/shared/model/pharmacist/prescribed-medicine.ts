export class Medicine {
  medicineId: number;
  medicineName?: string;
  price: number;
  dosage?: string;
  duration?: string;
  pMedicineId: number;
  isIssued?: boolean;

  constructor(
    medicineId: number = 0,
    price: number = 0,
    pMedicineId: number = 0,
    medicineName?: string,
    dosage?: string,
    duration?: string
  ) {
    this.medicineId = medicineId;
    this.price = price;
    this.pMedicineId = pMedicineId;
    this.medicineName = medicineName;
    this.dosage = dosage;
    this.duration = duration;
    
  }
}

export class PrescribedMedicine {
  pMedicineId: number;
  prescriptionId: number;
  medicineId: number;
  dosage?: string;
  duration?: string;
  isIssued?: boolean;
  medicines?: Medicine[];
  doctorFirstName: any;
  doctorLastName: any;
  patientFirstName: any;
  patientLastName: any;

  constructor(
    pMedicineId: number = 0,
    prescriptionId: number = 0,
    medicineId: number = 0,
    dosage?: string,
    duration?: string,
    isIssued?: boolean,
    medicines?: Medicine[]
  ) {
    this.pMedicineId = pMedicineId;
    this.prescriptionId = prescriptionId;
    this.medicineId = medicineId;
    this.dosage = dosage;
    this.duration = duration;
    this.isIssued = isIssued;
    this.medicines = medicines;
  }
}