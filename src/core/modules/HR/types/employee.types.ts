// core/modules/HR/types/employee.types.ts
export type EmployeeStatus = 'active' | 'inactive' | 'onLeave';

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  status: EmployeeStatus;
  joinDate?: string;
  phone?: string;
  // إضافة Index Signature
  [key: string]: string | EmployeeStatus | undefined;
}