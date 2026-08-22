export interface ContractEmployee {
  id: number;
  full_name: string;
  email: string;
}

export interface Contract {
  id: number;
  contract_number: string;
  employee_id: number;
  employee?: ContractEmployee;
  job_title: string;
  department: string;
  start_date: string;
  end_date: string;
  hour_price: string;
  working_hours_per_day: number;
  weekend_days: string[];
  estimated_monthly_salary: number;
  termination_notice_days: number;
  jurisdiction: string;
  signed_at: string;
  status: 'active' | 'expired' | 'renewed';
  created_at: string;
  updated_at: string;
}