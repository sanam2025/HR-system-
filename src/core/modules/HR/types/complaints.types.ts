// core/modules/HR/types/complaints.types.ts

export type ComplaintPriority = "high" | "medium" | "low";
export type ComplaintStatus = "open" | "inProgress" | "resolved" | "closed";
export type ResignationStatus = "pending" | "approved" | "rejected" | "withdrawn";

export interface Complaint {
  id: string;
  employeeName: string;
  department: string;
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  submittedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
}

export interface ResignationRequest {
  id: string;
  employeeName: string;
  department: string;
  position: string;
  lastWorkingDay: string;
  reason: string;
  status: ResignationStatus;
  submittedDate: string;
  approvedDate?: string;
  notes?: string;
}

export interface ComplaintsStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  highPriority: number;
}

export interface ResignationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  withdrawn: number;
}

export const priorityConfig: Record<ComplaintPriority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-100 text-red-700" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", className: "bg-green-100 text-green-700" },
};

export const complaintStatusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  open: { label: "Open", className: "bg-red-100 text-red-700" },
  inProgress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  resolved: { label: "Resolved", className: "bg-green-100 text-green-700" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-700" },
};

export const resignationStatusConfig: Record<ResignationStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-100 text-gray-700" },
};

export const calculateComplaintStats = (complaints: Complaint[]): ComplaintsStats => {
  return {
    total: complaints.length,
    open: complaints.filter(c => c.status === "open").length,
    inProgress: complaints.filter(c => c.status === "inProgress").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    closed: complaints.filter(c => c.status === "closed").length,
    highPriority: complaints.filter(c => c.priority === "high").length,
  };
};

export const calculateResignationStats = (resignations: ResignationRequest[]): ResignationStats => {
  return {
    total: resignations.length,
    pending: resignations.filter(r => r.status === "pending").length,
    approved: resignations.filter(r => r.status === "approved").length,
    rejected: resignations.filter(r => r.status === "rejected").length,
    withdrawn: resignations.filter(r => r.status === "withdrawn").length,
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};