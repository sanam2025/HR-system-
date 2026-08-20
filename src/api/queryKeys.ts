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
  },
  leaveRequests: {
    all: ["leave-requests"] as const,
    list: (page: number = 1) => [...queryKeys.leaveRequests.all, "list", page] as const,
    detail: (id: number) => [...queryKeys.leaveRequests.all, "detail", id] as const,
    mine: (params: Record<string, unknown>) =>
      [...queryKeys.leaveRequests.all, "mine", params] as const,
    myBalance: () => [...queryKeys.leaveRequests.all, "my-balance"] as const,
  },
  hourlyLeaveRequests: {
    all: ["hourly-leave-requests"] as const,
    list: (page: number = 1) => [...queryKeys.hourlyLeaveRequests.all, "list", page] as const,
    detail: (id: number) => [...queryKeys.hourlyLeaveRequests.all, "detail", id] as const,
    mine: (params: Record<string, unknown>) =>
      [...queryKeys.hourlyLeaveRequests.all, "mine", params] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (params: Record<string, unknown>) => [...queryKeys.tasks.all, "list", params] as const,
    detail: (id: number) => [...queryKeys.tasks.all, "detail", id] as const,
  },
  payroll: {
    all: ["payroll"] as const,
    myPayslips: (page: number = 1) => [...queryKeys.payroll.all, "my-payslips", page] as const,
    currentMonthPayslips: () => [...queryKeys.payroll.all, "current-month-payslips"] as const,
    payslipsSummary: () => [...queryKeys.payroll.all, "payslips-summary"] as const,
    myBaseSalaries: () => [...queryKeys.payroll.all, "my-base-salaries"] as const,
    myDeductions: (page: number = 1) => [...queryKeys.payroll.all, "my-deductions", page] as const,
    myIncentives: () => [...queryKeys.payroll.all, "my-incentives"] as const,
  },
  overtime: {
    all: ["overtime"] as const,
    mine: () => [...queryKeys.overtime.all, "mine"] as const,
  },
  complaints: {
    all: ["complaints"] as const,
    mine: () => [...queryKeys.complaints.all, "mine"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
  },
  announcements: {
    all: ["announcements"] as const,
    active: () => [...queryKeys.announcements.all, "active"] as const,
  },
  people: {
    all: ["people"] as const,
    employees: () => [...queryKeys.people.all, "employees"] as const,
    managers: () => [...queryKeys.people.all, "managers"] as const,
  },
  resignations: {
    all: ["resignations"] as const,
    mine: () => [...queryKeys.resignations.all, "mine"] as const,
  },
} as const;
