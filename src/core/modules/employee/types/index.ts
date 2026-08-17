export const TaskStatus = {
  InProgress: "In Progress",
  Completed: "Completed",
  Pending: "Pending",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const AttendanceStatus = {
  InProgress: "In Progress",
  CheckedOut: "Checked Out",
  NotStarted: "Not Started",
} as const;
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const LeaveRequestStatus = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
} as const;
export type LeaveRequestStatus = (typeof LeaveRequestStatus)[keyof typeof LeaveRequestStatus];

export const DocumentType = {
  Pdf: "pdf",
  Image: "image",
  Doc: "doc",
} as const;
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const ContractType = {
  FullTime: "Full Time",
  PartTime: "Part Time",
  Contract: "Contract",
} as const;
export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export interface Manager {
  name: string;
  avatar: string;
}

export interface LeaveEntitlement {
  daysLeft: number;
  total: number;
  used: number;
}

export interface LeaveBalance {
  annual: LeaveEntitlement;
  sick: LeaveEntitlement;
  unpaid: Pick<LeaveEntitlement, "used">;
}

export interface EmployeeProfile {
  id: number;
  fullName: string;
  jobTitle: string;
  department: string;
  employeeId: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  address: string;
  joinDate: string;
  contractType: ContractType;
  manager: Manager;
  avatar: string;
}

export interface DailyAttendance {
  currentTime: string;
  status: AttendanceStatus;
}

export interface EmployeeTask {
  id: number;
  title: string;
  dueDate: string;
  status: TaskStatus;
  completed: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
}

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  size: string;
}

export interface Payslip {
  month: string;
  year: number;
  basicSalary: number;
  bonuses: number;
  deductions: number;
  netAmount: number;
}

export interface AssignedTask {
  id: number;
  title: string;
  dueDate: string;
  status: TaskStatus;
}

export interface LeaveRequest {
  id: number;
  type: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveRequestStatus;
}

export interface AttendanceLogEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
}

export interface EmploymentStatus {
  joinDate: string;
  tenure: string;
  contractType: ContractType;
  manager: Manager;
}

export interface DashboardData {
  greeting: string;
  date: string;
  dailyAttendance: DailyAttendance;
  leaveBalance: LeaveBalance;
  recentTasks: EmployeeTask[];
  announcements: Announcement[];
}

export interface ProfilePageData {
  profile: EmployeeProfile;
  personalDetails: Record<string, string>;
  documents: Document[];
  employmentStatus: EmploymentStatus;
}

export interface TasksFinanceData {
  payslip: Payslip;
  assignedTasks: AssignedTask[];
}

export interface AttendancePageData {
  alertMessage: string;
  pendingRequests: LeaveRequest[];
  recentLog: AttendanceLogEntry[];
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "pending" | "danger";
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "green" | "brown";
}

export interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  valueColor?: string;
}

export interface AlertBannerProps {
  message: string;
  onClose?: () => void;
}
