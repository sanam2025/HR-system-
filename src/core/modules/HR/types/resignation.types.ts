
export type ResignationType = "standard" | "immediate";
export type ResignationStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface ResignationRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  position: string;
  resignationType: ResignationType;
  lastWorkingDay: string;
  submittedDate: string;
  reason: string;
  status: ResignationStatus;
  approvedDate?: string;
  notes?: string;  baseSalary: number;
  yearsOfService: number;
  compensationAmount?: number;
}

export interface CompensationDetails {
  baseSalary: number;
  yearsOfService: number;
  endOfServiceBenefit: number;
  immediateResignationPenalty: number;
  totalCompensation: number;
}

export const resignationTypeConfig: Record<ResignationType, { label: string; className: string }> = {
  standard: { label: "Standard", className: "bg-blue-100 text-blue-700" },
  immediate: { label: "Immediate", className: "bg-orange-100 text-orange-700" },
};

export const resignationStatusConfig: Record<ResignationStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-100 text-gray-700" },
};

export const calculateResignationCompensation = (
  baseSalary: number, 
  yearsOfService: number, 
  resignationType: ResignationType
): CompensationDetails => {
  const endOfServiceBenefit = baseSalary * yearsOfService;
  const immediateResignationPenalty = resignationType === "immediate" ? endOfServiceBenefit * 0.2 : 0;
  const totalCompensation = endOfServiceBenefit - immediateResignationPenalty;
  
  return {
    baseSalary,
    yearsOfService,
    endOfServiceBenefit,
    immediateResignationPenalty,
    totalCompensation: totalCompensation > 0 ? totalCompensation : 0,
  };
};