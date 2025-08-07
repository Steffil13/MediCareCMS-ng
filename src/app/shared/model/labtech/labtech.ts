export class Labtech {
}
export interface TestResult {
  testResultId: number;
  resultValue: string;
  resultStatus: boolean;
  remarks: string;
  recordDate: string;
  createdDate: string;
  plabTestId: number;
  patientName: string;
  testName: string;
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

