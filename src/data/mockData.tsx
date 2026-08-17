// ── Mock data for MANAGER section (fully English compatible) ─────────────────

export const mockEmployees = [
  { id: 1, name: 'Ahmed Mohamed Al-Saleh', nameEn: 'Ahmed Mohamed Al-Saleh', title: 'Frontend Developer', titleEn: 'Frontend Developer', avatar: 'A', avgRating: 4.5, todayStatus: 'Present', leaveBalance: 14, tasksCount: 3, phone: '0912345678', email: 'ahmed@hr.com', joinDate: '2022-01-15', department: 'IT Department', departmentEn: 'IT Department' },
  { id: 2, name: 'Sara Ali Hassan', nameEn: 'Sara Ali Hassan', title: 'Backend Developer', titleEn: 'Backend Developer', avatar: 'S', avgRating: 4.8, todayStatus: 'Present', leaveBalance: 10, tasksCount: 2, phone: '0923456789', email: 'sara@hr.com',  joinDate: '2021-08-01', department: 'IT Department', departmentEn: 'IT Department' },
  { id: 3, name: 'Mohamed Omar Ibrahim', nameEn: 'Mohamed Omar Ibrahim', title: 'Systems Analyst', titleEn: 'Systems Analyst', avatar: 'M', avgRating: 3.9, todayStatus: 'Absent', leaveBalance: 7,  tasksCount: 1, phone: '0934567890', email: 'omar@hr.com',  joinDate: '2023-03-20', department: 'IT Department', departmentEn: 'IT Department' },
  { id: 4, name: 'Layla Youssef Karim', nameEn: 'Layla Youssef Karim', title: 'UX Designer', titleEn: 'UX Designer', avatar: 'L', avgRating: 4.2, todayStatus: 'Present', leaveBalance: 18, tasksCount: 4, phone: '0945678901', email: 'layla@hr.com', joinDate: '2020-11-10', department: 'IT Department', departmentEn: 'IT Department' },
  { id: 5, name: 'Khalid Sami Nour', nameEn: 'Khalid Sami Nour', title: 'Database Manager', titleEn: 'Database Manager', avatar: 'K', avgRating: 4.0, todayStatus: 'Late',leaveBalance: 5,  tasksCount: 2, phone: '0956789012', email: 'khalid@hr.com',joinDate: '2022-06-05', department: 'IT Department', departmentEn: 'IT Department' },
  { id: 6, name: 'Nour Bashar Amin', nameEn: 'Nour Bashar Amin', title: 'App Developer', titleEn: 'App Developer', avatar: 'N', avgRating: 4.7, todayStatus: 'Present', leaveBalance: 12, tasksCount: 3, phone: '0967890123', email: 'nour@hr.com',  joinDate: '2021-02-28', department: 'IT Department', departmentEn: 'IT Department' },
];

export const mockTasks = [
  { id: 1, title: 'Develop Dashboard Layout',   assigneeId: 1, assigneeName: 'Ahmed Mohamed', status: 'In Progress', priority: 'High', dueDate: '2026-05-20', description: 'Build dashboard shell and layouts', rating: null, createdAt: '2026-05-01' },
  { id: 2, title: 'Fix Report API Bugs',   assigneeId: 2, assigneeName: 'Sara Ali',  status: 'New',       priority: 'Medium',dueDate: '2026-05-18', description: 'Review endpoints and fix issues', rating: null, createdAt: '2026-05-05' },
  { id: 3, title: 'Database Update',       assigneeId: 5, assigneeName: 'Khalid Sami', status: 'Completed',      priority: 'High', dueDate: '2026-05-10', description: 'Upgrade schema and indices', rating: 4,    createdAt: '2026-04-25' },
  { id: 4, title: 'Design Mobile Screen',       assigneeId: 4, assigneeName: 'Layla Youssef', status: 'Late',      priority: 'High', dueDate: '2026-05-08', description: 'Figma mockups for iOS/Android',       rating: null, createdAt: '2026-04-20' },
  { id: 5, title: 'Write Project Docs',        assigneeId: 3, assigneeName: 'Mohamed Omar',  status: 'In Progress', priority: 'Low',dueDate: '2026-05-25', description: 'Documentation for endpoints',          rating: null, createdAt: '2026-05-06' },
  { id: 6, title: 'Auth Code Review',        assigneeId: 6, assigneeName: 'Nour Bashar',  status: 'Completed',      priority: 'High', dueDate: '2026-05-12', description: 'Security audit and code review',         rating: 5,    createdAt: '2026-04-30' },
  { id: 7, title: 'System Load Testing',          assigneeId: 1, assigneeName: 'Ahmed Mohamed', status: 'New',       priority: 'Medium',dueDate: '2026-05-22', description: 'Performance and load tests',         rating: null, createdAt: '2026-05-07' },
];

export const mockLeaveRequests = [
  { id: 1, employeeId: 3, employeeName: 'Mohamed Omar Ibrahim', type: 'Annual',    from: '2026-05-15', to: '2026-05-20', days: 6, reason: 'Family trip',           status: 'Pending',   leaveBalance: 7,  requestDate: '2026-05-08' },
  { id: 2, employeeId: 5, employeeName: 'Khalid Sami Nour',    type: 'Sick',    from: '2026-05-12', to: '2026-05-13', days: 2, reason: 'Medical appointment',            status: 'Pending',   leaveBalance: 5,  requestDate: '2026-05-09' },
  { id: 3, employeeId: 1, employeeName: 'Ahmed Mohamed Al-Saleh', type: 'Emergency',    from: '2026-05-14', to: '2026-05-14', days: 1, reason: 'Family emergency',     status: 'Pending',   leaveBalance: 14, requestDate: '2026-05-10' },
  { id: 4, employeeId: 2, employeeName: 'Sara Ali Hassan',     type: 'Annual',    from: '2026-06-01', to: '2026-06-07', days: 7, reason: 'Travel',                    status: 'Approved',  leaveBalance: 10, requestDate: '2026-05-02' },
  { id: 5, employeeId: 4, employeeName: 'Layla Youssef Karim',   type: 'Unpaid',from: '2026-05-20', to: '2026-05-25', days: 6, reason: 'Exams & study',       status: 'Rejected', leaveBalance: 18, requestDate: '2026-05-07' },
];

export const mockOvertimeRequests = [
  { id: 1, employeeId: 1, employeeName: 'Ahmed Mohamed Al-Saleh', date: '2026-05-12', hours: 3, reason: 'Urgent task completion',      status: 'Pending',  requestDate: '2026-05-09' },
  { id: 2, employeeId: 6, employeeName: 'Nour Bashar Amin',    date: '2026-05-13', hours: 2, reason: 'Client meeting',       status: 'Pending',  requestDate: '2026-05-10' },
  { id: 3, employeeId: 2, employeeName: 'Sara Ali Hassan',     date: '2026-05-10', hours: 4, reason: 'Release launch support',   status: 'Approved', requestDate: '2026-05-08' },
];

export const mockAttendance = [
  { date: '2026-05-11', checkIn: '08:05', checkOut: '17:00', status: 'Present',  delay: 5,   earlyLeave: 0 },
  { date: '2026-05-10', checkIn: '08:30', checkOut: '17:00', status: 'Late', delay: 30,  earlyLeave: 0 },
  { date: '2026-05-09', checkIn: '08:00', checkOut: '17:00', status: 'Present',  delay: 0,   earlyLeave: 0 },
  { date: '2026-05-08', checkIn: null,    checkOut: null,    status: 'Absent',  delay: 0,   earlyLeave: 0 },
  { date: '2026-05-07', checkIn: '08:10', checkOut: '16:30', status: 'Present',  delay: 10,  earlyLeave: 30 },
  { date: '2026-05-06', checkIn: '08:00', checkOut: '17:00', status: 'Present',  delay: 0,   earlyLeave: 0 },
  { date: '2026-05-05', checkIn: '09:00', checkOut: '17:00', status: 'Late', delay: 60,  earlyLeave: 0 },
];

export const mockCandidates = [
  { id: 1, name: 'Rami Hassan Khalil',   position: 'React Developer', experience: 4, skills: ['React', 'TypeScript', 'Node.js'], interviewScore: 85, cvScore: 80, rank: null, notes: 'Good experience in big projects' },
  { id: 2, name: 'Dana Salim Ahmed',  position: 'React Developer', experience: 2, skills: ['React', 'CSS', 'JavaScript'],    interviewScore: 78, cvScore: 75, rank: null, notes: 'Fast learner, highly motivated' },
  { id: 3, name: 'Bassem Adel Omar',   position: 'React Developer', experience: 6, skills: ['React', 'Redux', 'GraphQL'],    interviewScore: 90, cvScore: 88, rank: null, notes: 'Broad experience and leadership skills' },
  { id: 4, name: 'Hana Mohamed Fadel',   position: 'React Developer', experience: 3, skills: ['React', 'Vue', 'Tailwind'],     interviewScore: 72, cvScore: 70, rank: null, notes: 'Excellent UX/UI and detail-oriented' },
];

export const mockDashboardStats = {
  totalEmployees: 6,
  presentToday: 4,
  avgPerformance: 4.4,
  attendanceRate: 87,
  pendingLeaves: 3,
  pendingTasks: 4,
  completedTasksThisMonth: 8,
  pendingOvertime: 2,
};

export const mockPerformanceChart = [
  { month: 'Jan', avgRating: 4.1, attendance: 90 },
  { month: 'Feb', avgRating: 4.3, attendance: 88 },
  { month: 'Mar', avgRating: 4.0, attendance: 85 },
  { month: 'Apr', avgRating: 4.5, attendance: 92 },
  { month: 'May', avgRating: 4.4, attendance: 87 },
];
