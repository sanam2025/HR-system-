import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "../finance";
import { queryKeys } from "../queryKeys";

export function useMyBaseSalaries() {
  return useQuery({
    queryKey: queryKeys.baseSalaries.mine(),
    queryFn: () => api.listMyBaseSalaries(),
  });
}

export function useMyDeductions() {
  return useQuery({
    queryKey: queryKeys.deductions.mine(),
    queryFn: () => api.listMyDeductions(),
  });
}

export function useMyIncentives() {
  return useQuery({
    queryKey: queryKeys.incentives.mine(),
    queryFn: () => api.listMyIncentives(),
  });
}

export function useCurrentPayroll() {
  return useQuery({
    queryKey: queryKeys.payroll.current(),
    queryFn: () => api.getCurrentPayroll(),
  });
}

export function useMyPayslips() {
  return useQuery({
    queryKey: queryKeys.payslips.mine(),
    queryFn: () => api.listMyPayslips(),
  });
}

export function useCurrentMonthPayslips() {
  return useQuery({
    queryKey: queryKeys.payslips.currentMonth(),
    queryFn: () => api.listCurrentMonthPayslips(),
  });
}

export function usePayslipsSummary() {
  return useQuery({
    queryKey: queryKeys.payslips.summary(),
    queryFn: () => api.getPayslipsSummary(),
  });
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function useDownloadPayslip() {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await api.downloadPayslip(id);
      triggerBrowserDownload(response.data as Blob, `payslip-${id}.pdf`);
    },
  });
}

/** Opens the payslip preview in a new tab rather than downloading it. */
export function usePreviewPayslip() {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const response = await api.previewPayslip(id);
      const url = URL.createObjectURL(response.data as Blob);
      window.open(url, "_blank", "noopener,noreferrer");
    },
  });
}
