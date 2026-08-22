export interface PayrollRecord {
  id: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  deductions: number;
  bonuses: number;
  netSalary: number;
  month: string;
  year: number;
}export interface IncentiveRecord {
  id: number;
  user_id: number;
  amount: number;
  reason: string;
  date: string;
  user?: { full_name: string };
}export interface DeductionRecord {
  id: number;
  user_id: number;
  amount: number;
  reason: string;
  date: string;
  user?: { full_name: string };
}