
export type ContractStatus = "active" | "expired" | "renewed" | "terminated";
export type RenewalStatus = "pending" | "approved" | "rejected" | "expired";

export interface EmployeeContract {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  salary: number;
  workingHours: string;
  benefits: string;
  status: ContractStatus;
  signedDate?: string;
  pdfUrl?: string;
}

export interface ContractRenewal {
  id: string;
  contractId: string;
  employeeId: string;
  employeeName: string;
  oldEndDate: string;
  newEndDate: string;
  newSalary?: number;
  renewalReason: string;
  status: RenewalStatus;
  sentDate: string;
  approvedDate?: string;
  notes?: string;
}

export const contractStatusConfig: Record<ContractStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  expired: { label: "Expired", className: "bg-red-100 text-red-700" },
  renewed: { label: "Renewed", className: "bg-blue-100 text-blue-700" },
  terminated: { label: "Terminated", className: "bg-gray-100 text-gray-700" },
};

export const renewalStatusConfig: Record<RenewalStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  expired: { label: "Expired", className: "bg-gray-100 text-gray-700" },
};