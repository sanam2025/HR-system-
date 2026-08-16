import type { UserStatus } from "../../auth/Types/types";

export type AdminProps = {
  title: string,
  icon: React.ReactNode;
  image?: string;
  adminSidebar: AdminSidebar[];
}

export type AdminSidebar = {
  path: string,
  title: string,
  match?: string,
  icon: React.ReactNode
}

export type HolidaysType = 'official' | 'company';

export type Holidays = {
  id: number,
  name: string,
  type: HolidaysType,
  date: Date,
  updated_at: Date,
  created_at: Date,
}

export type CreateHolidayPayload = {
  name: string;
  type: HolidaysType;
  date: string;
}

export type AnnouncementsPriority = 'low' | 'medium' | 'high';
export type AnnouncementsTargetAudience = 'all' | 'managers' | 'department';
export type AnnouncementsStatus = 'scheduled' | 'active';

export type Announcements = {
  id: number;
  title: string;
  content: string;
  priority: AnnouncementsPriority;
  target_audience: string;
  author:{
    id:number,
    full_name: string,
  };
  status: AnnouncementsStatus;
  starts_at: Date;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export type CreateAnnouncemetPayload = {
  title: string ;
  content: string ;
  priority: AnnouncementsPriority ;
  target_audience: AnnouncementsTargetAudience ;
  starts_at: string ;
  expires_at: string ;
}

export type Department = {
  id : number,
  name : string,
  created_at : Date,
  updated_at : Date,
  users_count : number
}

export type DepartmentCount = {
  departments_count: number
}

export type UsersCount = {
  total_users : number,
  employees_count : number,
  managers_count : number,
  others_count : number
}


export type Employees = {
  id : number,
  name : string,
  email : string,
  department : string,
  job_title : string,
  status : UserStatus,
  profile_id : number
}

export type Managers = {
  id :  number,
  name : string,
  email : string,
  department : string,
  job_title : string,
  status : UserStatus,
  profile_id : number 
}

export type EmployeeSearch = {
  id: number,
  full_name: string,
  job_title: string,
  email: string,
  dep_id: number,
  status: string,
  is_first_login?: number,
  onboarding_completed_at?: Date,
  email_verified_at?: Date,
  created_at?: Date,
  updated_at?: Date
}

export type AttendancePrecentage = {
  present_percentage : number
  absent_percentage : number
  late_percentage : number
}

export type PayrollStatus = "completed" | "pending" | "failed" | "processing" | "cancelled";

export type Payrolls = {
  id : number,
  month : number,
  year : number,
  status : PayrollStatus,
  total_salary : number
}

export type PayrollSummary = {
  employees: number;
  approved_leaves: number;
  completed_overtime: number;
  incentives: number;
  deductions: number;
};

export type CurrentPayroll = {
  payroll: Omit<Payrolls, 'total_salary'>;
  ready: boolean;
  summary: PayrollSummary;
  errors: string[];
  "total salaries": number;
};


export type TerminationStatus = "pending" | "approved" | "rejected" | "cancelled";

export type TerminationType = "immediate" | "mutual" | "contract_end";

export type TerminationSubtype = "misconduct" | "resignation" | "redundancy" | "retirement" | "health" | "other";

export type ApprovalStep = {
  id: number;
  step: number;
  role: string;
  status: TerminationStatus;
  decision_reason: string | null;
  approved_by: number | null;
  approved_at: string | null;
};

export type ImmediateTermination = {
  id: number;
  subtype: TerminationSubtype;
  compensation_amount: number | null;
  legal_reason: string | null;
  documents_path: string | null;
  notes: string | null;
};

export type User = {
  id: number;
  name: string;
  role?: string;
};

export type Termination = {
  id: number;
  user: User;
  contract_id: number;
  created_by: User;
  type: TerminationType;
  termination_date: string;
  last_working_day: string;
  notice_period_days: number;
  ready_for_admin: number;
  status: TerminationStatus;
  approvals: ApprovalStep[];
  immediate_termination?: ImmediateTermination | null;
  mutual_termination?: any | null;
  contract_end_termination?: any | null;
};

export type TerminationsResponse = {
  data: Termination[];
};

export type TerminationAction = "approve" | "reject";

export type Settings = {
  expected_check_in: string;
  expected_check_out: string;
  grace_period: number;
  weekend_days: string[];
  sick_leave_days: number;
  annual_leave_days: number;
  probation_period_days: number;
  termination_notice_days: number;
  jurisdiction: string;
  currency: string;
  updated_at: string;
};

export type TopRate = {
  year : number,
  quarter : number,
  employees : Employees[]
}