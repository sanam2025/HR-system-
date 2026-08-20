import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../payroll";
import { queryKeys } from "../queryKeys";

export function useMyPayslips(page: number = 1) {
  return useQuery({
    queryKey: queryKeys.payroll.myPayslips(page),
    queryFn: () => api.listMyPayslips({ params: { page } }),
  });
}

export function useCurrentMonthPayslips() {
  return useQuery({
    queryKey: queryKeys.payroll.currentMonthPayslips(),
    queryFn: () => api.getCurrentMonthPayslips(),
  });
}

export function usePayslipsSummary() {
  return useQuery({
    queryKey: queryKeys.payroll.payslipsSummary(),
    queryFn: () => api.getPayslipsSummary(),
  });
}

export function useMyBaseSalaries() {
  return useQuery({
    queryKey: queryKeys.payroll.myBaseSalaries(),
    queryFn: () => api.listMyBaseSalaries(),
  });
}

export function useMyDeductions(page: number = 1) {
  return useQuery({
    queryKey: queryKeys.payroll.myDeductions(page),
    queryFn: () => api.listMyDeductions({ params: { page } }),
  });
}

export function useMyIncentives() {
  return useQuery({
    queryKey: queryKeys.payroll.myIncentives(),
    queryFn: () => api.listMyIncentives(),
  });
}

/**
 * Triggers a browser download for a payslip PDF. The mutation resolves once
 * the blob has been handed to the browser's download flow.
 */
export function useDownloadPayslip() {
  return useMutation({
    mutationFn: async (id: number) => {
      const blob = await api.downloadPayslip(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payslip-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
  });
}
