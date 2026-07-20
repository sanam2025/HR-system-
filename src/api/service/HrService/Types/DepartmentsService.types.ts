// src/api/service/HrService/Types/DepartmentsService.types.ts
export interface Department {
  id: number;
  name: string;
  description?: string;
  manager_id?: number;
  manager_name?: string;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentWithEmployees extends Department {
  employees: Employee[];
}

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  position?: string;
  department_id: number;
  department_name?: string;
  status: 'active' | 'inactive';
  profile?: Profile;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  user_id: number;
  gender?: string;
  birth_date?: string;
  phone_number?: string;
  address?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}