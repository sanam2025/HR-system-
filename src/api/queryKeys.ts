/**
 * Centralized query-key factory. Keeping every key in one place means a
 * mutation can invalidate exactly the queries it affects without hooks
 * having to import each other's private key arrays.
 */
export const queryKeys = {
  onboarding: {
    all: ["onboarding"] as const,
    status: () => [...queryKeys.onboarding.all, "status"] as const,
  },
  documents: {
    all: ["documents"] as const,
    myContract: () => [...queryKeys.documents.all, "my-contract"] as const,
    myDocuments: () => [...queryKeys.documents.all, "my-documents"] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    mine: () => [...queryKeys.profiles.all, "mine"] as const,
    detail: (id: number) => [...queryKeys.profiles.all, "detail", id] as const,
  },
  attendance: {
    all: ["attendance"] as const,
    myMonthly: () => [...queryKeys.attendance.all, "my-monthly"] as const,
    filtered: (params: Record<string, unknown>) =>
      [...queryKeys.attendance.all, "filtered", params] as const,
    percentage: () => [...queryKeys.attendance.all, "percentage"] as const,
  },
  leaveRequests: {
    all: ["leave-requests"] as const,
    list: () => [...queryKeys.leaveRequests.all, "list"] as const,
    detail: (id: number) => [...queryKeys.leaveRequests.all, "detail", id] as const,
    mine: (params: Record<string, unknown>) =>
      [...queryKeys.leaveRequests.all, "mine", params] as const,
    myBalance: () => [...queryKeys.leaveRequests.all, "my-balance"] as const,
  },
  hourlyLeaveRequests: {
    all: ["hourly-leave-requests"] as const,
    list: () => [...queryKeys.hourlyLeaveRequests.all, "list"] as const,
    detail: (id: number) => [...queryKeys.hourlyLeaveRequests.all, "detail", id] as const,
    mine: (params: Record<string, unknown>) =>
      [...queryKeys.hourlyLeaveRequests.all, "mine", params] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.tasks.all, "list", params] as const,
    show: (id: number | string) => [...queryKeys.tasks.all, "show", id] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
  },
  baseSalaries: {
    all: ["baseSalaries"] as const,
    mine: () => [...queryKeys.baseSalaries.all, "mine"] as const,
  },
  deductions: {
    all: ["deductions"] as const,
    mine: () => [...queryKeys.deductions.all, "mine"] as const,
  },
  incentives: {
    all: ["incentives"] as const,
    mine: () => [...queryKeys.incentives.all, "mine"] as const,
  },
  payroll: {
    all: ["payroll"] as const,
    current: () => [...queryKeys.payroll.all, "current"] as const,
  },
  payslips: {
    all: ["payslips"] as const,
    mine: () => [...queryKeys.payslips.all, "mine"] as const,
    currentMonth: () => [...queryKeys.payslips.all, "current-month"] as const,
    summary: () => [...queryKeys.payslips.all, "summary"] as const,
    show: (id: number | string) => [...queryKeys.payslips.all, "show", id] as const,
  },
  evaluations: {
    all: ["evaluations"] as const,
    mine: () => [...queryKeys.evaluations.all, "mine"] as const,
  },
  overtime: {
    all: ["overtime"] as const,
    mine: () => [...queryKeys.overtime.all, "mine"] as const,
  },
  termination: {
    all: ["termination"] as const,
    mine: () => [...queryKeys.termination.all, "mine"] as const,
  },
  complaints: {
    all: ["complaints"] as const,
    mine: () => [...queryKeys.complaints.all, "mine"] as const,
  },
} as const;
