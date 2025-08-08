import { Department } from "./department";

export interface User {
  userId: number;
  username: string;
  password?: string;       // optional for security, avoid exposing passwords in frontend
  roleId: number;
  roleName: string;
  
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string;       // could be computed from firstName + lastName
  email?: string | null;
  contact?: string | null;
  address?: string | null;
  dob?: string | null;     // Use ISO date string or Date if you convert
  gender?: string | null;
  bloodGroup?: string | null;

  departmentId?: number | null;
  departmentList?: Department[] | null;   // if nested, optional

  isActive: boolean;
  isActiveNullable?: boolean | null;      // based on naming from your data

  employeeId?: number | null;              // optional staff id

  // Other potential fields depending on your API
  roleList?: any;                          // If you have a list of roles
}
