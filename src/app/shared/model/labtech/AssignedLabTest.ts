export class Labtest {
    
  plabTestId: number = 0;
  prescriptionId: number = 0;
  labId: number = 0;
  labName: string = '';
  doctorName: string = '';
  patientName: string = '';
  isCompleted: boolean = false;
  static plabTestId: any;
}

export class TestResultHistory {
  testResultId: number = 0;
  patientName: string = "";
  testName: string = "";
  resultValue: string = "";
  remarks: string = "";
  recordDate: string = "";
  registerNumber:string="";
  
resultStatus: boolean = false; // Assuming status is a boolean indicating pass/fail
}
