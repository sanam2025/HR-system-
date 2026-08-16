export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithData<T> {
  success: boolean;
  message: string;
  data: T;
  status_code: number;
}

export interface APIResponseWithDataArray<T> {
  success: boolean;
  message: string;
  data: T[];
  status_code: number;
}

export interface APIResponseWithOnlyData<T>{
  data: T;
}

export interface APIResponseWithOnlyDataArray<T>{
  data: T[];
}

export interface APIResponseWithToken<T>{
  message: string;
  data: {
    user: T
  };
  Token: string;
  status_code: number;
}

export type EmployeeRole = "admin" | "HR" | "manager" | "employee";

export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  job_title: string | null;
  status: EmployeeStatus;
  profile_id: number | null;
}

export interface EmployeesByRole {
  admin: Employee[];
  HR: Employee[];
  manager: Employee[];
  employee: Employee[];
}

export interface EmployeesCounts {
  admin: number;
  HR: number;
  manager: number;
  employee: number;
}


export interface EmployeesResponseData {
  data: EmployeesByRole;
  counts: EmployeesCounts;
}

export type EmployeesAPIResponse = APIResponse<EmployeesResponseData>;

export type EmployeesAPIResponseSimple = {
  success: boolean;
  data: EmployeesByRole;
  counts: EmployeesCounts;
};