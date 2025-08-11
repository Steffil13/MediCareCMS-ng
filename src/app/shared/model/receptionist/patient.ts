export class Patient {
    patientId!: number;
    firstName!: string;
    lastName!: string;
    gender!: string;
    dob!: Date | string;
    contact!: string;
    emergencyNumber!: string;  // added this field
    email?: string;
    address?: string;
    bloodGroup!: string;
    registerNumber?: string;
}
