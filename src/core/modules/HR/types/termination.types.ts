// core/modules/HR/types/termination.types.ts

export type TerminationType = "termination" | "contractEnd" | "resignation" | "retirement";
export type TerminationStatus = "draft" | "submitted" | "approved" | "processed" | "completed";

export interface TerminationRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  terminationType: TerminationType;
  effectiveDate: string;
  reason: string;
  status: TerminationStatus;
  submittedDate: string;
  processedBy?: string;
}

export interface CompensationDetails {
  baseSalary: number;
  yearsOfService: number;
  endOfServiceBenefit: number;
  unpaidLeave: number;
  pendingSalary: number;
  totalCompensation: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export const terminationTypeConfig: Record<TerminationType, { label: string; className: string }> = {
  termination: { label: "Termination", className: "bg-red-100 text-red-700" },
  contractEnd: { label: "Contract End", className: "bg-blue-100 text-blue-700" },
  resignation: { label: "Resignation", className: "bg-yellow-100 text-yellow-700" },
  retirement: { label: "Retirement", className: "bg-green-100 text-green-700" },
};

export const terminationStatusConfig: Record<TerminationStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  submitted: { label: "Submitted", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
  processed: { label: "Processed", className: "bg-purple-100 text-purple-700" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
};

export const calculateCompensation = (baseSalary: number, yearsOfService: number): CompensationDetails => {
  const endOfServiceBenefit = baseSalary * yearsOfService;
  return {
    baseSalary,
    yearsOfService,
    endOfServiceBenefit,
    unpaidLeave: 0,
    pendingSalary: 0,
    totalCompensation: endOfServiceBenefit,
  };
};