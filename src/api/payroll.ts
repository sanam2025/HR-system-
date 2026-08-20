import { getListOrEmpty, httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { BaseSalary, Deduction, Incentive, Payslip, PayslipsSummary } from "./models";

export async function listMyPayslips(options?: RequestOptions): Promise<Payslip[]> {
  return getListOrEmpty<Payslip>(endpoints.payroll.myPayslips, options);
}

export async function getPayslip(id: number, options?: RequestOptions): Promise<Payslip> {
  const response = await httpClient.get(endpoints.payroll.payslip(id), options);
  return unwrap<Payslip>(response);
}

export async function getCurrentMonthPayslips(options?: RequestOptions): Promise<Payslip[]> {
  return getListOrEmpty<Payslip>(endpoints.payroll.currentMonthPayslips, options);
}

export async function getPayslipsSummary(options?: RequestOptions): Promise<PayslipsSummary> {
  const response = await httpClient.get(endpoints.payroll.payslipsSummary, options);
  return unwrap<PayslipsSummary>(response);
}

export async function downloadPayslip(id: number, options?: RequestOptions): Promise<Blob> {
  const response = await httpClient.get(endpoints.payroll.payslipDownload(id), {
    ...options,
    responseType: "blob",
  });
  return response.data as Blob;
}

export async function listMyBaseSalaries(options?: RequestOptions): Promise<BaseSalary[]> {
  return getListOrEmpty<BaseSalary>(endpoints.payroll.myBaseSalaries, options);
}

export async function listMyDeductions(options?: RequestOptions): Promise<Deduction[]> {
  return getListOrEmpty<Deduction>(endpoints.payroll.myDeductions, options);
}

export async function listMyIncentives(options?: RequestOptions): Promise<Incentive[]> {
  return getListOrEmpty<Incentive>(endpoints.payroll.myIncentives, options);
}
