import { httpClient, unwrap, unwrapPaginated } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Paginated } from "../lib/http/types";
import type {
  BaseSalary,
  CurrentPayroll,
  Deduction,
  Incentive,
  Payslip,
  PayslipsSummary,
} from "./models";

export async function listMyBaseSalaries(
  options?: RequestOptions
): Promise<Paginated<BaseSalary>> {
  const response = await httpClient.get(endpoints.baseSalaries.mine, options);
  return unwrapPaginated<BaseSalary>(response);
}

export async function listMyDeductions(options?: RequestOptions): Promise<Paginated<Deduction>> {
  const response = await httpClient.get(endpoints.deductions.mine, options);
  return unwrapPaginated<Deduction>(response);
}

export async function listMyIncentives(options?: RequestOptions): Promise<Paginated<Incentive>> {
  const response = await httpClient.get(endpoints.incentives.mine, options);
  return unwrapPaginated<Incentive>(response);
}

export async function getCurrentPayroll(options?: RequestOptions): Promise<CurrentPayroll> {
  const response = await httpClient.get(endpoints.payroll.current, options);
  return unwrap<CurrentPayroll>(response);
}

export async function listMyPayslips(options?: RequestOptions): Promise<Paginated<Payslip>> {
  const response = await httpClient.get(endpoints.payslips.mine, options);
  return unwrapPaginated<Payslip>(response);
}

export async function listCurrentMonthPayslips(
  options?: RequestOptions
): Promise<Paginated<Payslip>> {
  const response = await httpClient.get(endpoints.payslips.currentMonth, options);
  return unwrapPaginated<Payslip>(response);
}

export async function getPayslipsSummary(options?: RequestOptions): Promise<PayslipsSummary> {
  const response = await httpClient.get(endpoints.payslips.summary, options);
  return unwrap<PayslipsSummary>(response);
}

export async function getPayslip(
  id: number | string,
  options?: RequestOptions
): Promise<Payslip> {
  const response = await httpClient.get(endpoints.payslips.show(id), options);
  return unwrap<Payslip>(response);
}

/** Returns the raw response so the caller can build a blob/object URL — payslip file, not JSON. */
export async function downloadPayslip(id: number | string) {
  return httpClient.get(endpoints.payslips.download(id), { responseType: "blob" });
}

export async function previewPayslip(id: number | string) {
  return httpClient.get(endpoints.payslips.preview(id), { responseType: "blob" });
}
