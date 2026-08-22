
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
}

export interface EmployeeEvaluation {
  id: string;
  employeeId: string;
  rating: number;
  comments: string;
  evaluatedBy: string;
  evaluationDate: string;
}