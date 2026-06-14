// core/modules/HR/types/payroll.types.ts

export type PayrollStatus = "paid" | "issued" | "draft" | "pending";

export interface PayrollRecord {
  id: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  deductions: number;
  bonuses: number;
  netSalary: number;
  status: PayrollStatus;
  month: string;
  year: number;
}

export interface PayrollSummary {
  totalBaseSalary: number;
  totalDeductions: number;
  totalBonuses: number;
  totalNetSalary: number;
  paidCount: number;
  issuedCount: number;
  draftCount: number;
  totalCount: number;
}

export const statusConfig: Record<PayrollStatus, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
  issued: { label: "Issued", className: "bg-blue-100 text-blue-700" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
};

export const calculatePayrollSummary = (records: PayrollRecord[]): PayrollSummary => {
  return {
    totalBaseSalary: records.reduce((sum, r) => sum + r.baseSalary, 0),
    totalDeductions: records.reduce((sum, r) => sum + r.deductions, 0),
    totalBonuses: records.reduce((sum, r) => sum + r.bonuses, 0),
    totalNetSalary: records.reduce((sum, r) => sum + r.netSalary, 0),
    paidCount: records.filter(r => r.status === "paid").length,
    issuedCount: records.filter(r => r.status === "issued").length,
    draftCount: records.filter(r => r.status === "draft").length,
    totalCount: records.length,
  };
};

export const formatSalary = (amount: number): string => {
  return `${amount.toLocaleString()} SYP`;
};