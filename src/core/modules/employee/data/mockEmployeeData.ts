import {
  TaskStatus,
  AttendanceStatus,
  LeaveRequestStatus,
  DocumentType,
  ContractType,
  type DashboardData,
  type ProfilePageData,
  type TasksFinanceData,
  type AttendancePageData,
} from "../types";

export const mockDashboardData: DashboardData = {
  greeting: "Hello, Sarah. Here's your day at Terra.",
  date: "TODAY Oct 24, 2023",
  dailyAttendance: {
    currentTime: "09:14 AM",
    status: AttendanceStatus.InProgress,
  },
  leaveBalance: {
    annual: { daysLeft: 14, total: 21, used: 7 },
    sick: { daysLeft: 5, total: 10, used: 5 },
    unpaid: { used: 0 },
  },
  recentTasks: [
    { id: 1, title: "Update Employee Handbook", dueDate: "Oct 28, 2023", status: TaskStatus.InProgress, completed: false },
    { id: 2, title: "Prepare Q3 Evaluation", dueDate: "Oct 25, 2023", status: TaskStatus.Completed, completed: true },
    { id: 3, title: "Coordinate Annual Workshop", dueDate: "Nov 5, 2023", status: TaskStatus.InProgress, completed: false },
  ],
  announcements: [
    { id: 1, title: "Team Lunch Friday", date: "Oct 27" },
    { id: 2, title: "Insurance Policy Update", date: "Nov 1" },
    { id: 3, title: "Office Closure on Nov 23", date: "Nov 23" },
  ],
};

export const mockProfileData: ProfilePageData = {
  profile: {
    id: 1,
    fullName: "Noura Al-Abdullah",
    jobTitle: "Software Engineer",
    department: "IT Department",
    employeeId: "EMP-2023-0842",
    phone: "+966 55 123 4567",
    email: "noura.abdullah@terra.com",
    dateOfBirth: "15 Mar 1995",
    nationality: "Saudi",
    maritalStatus: "Married",
    address: "Riyadh, Olaya District, Building 42",
    joinDate: "2023-01-15",
    contractType: ContractType.FullTime,
    manager: { name: "Ahmed Al-Saleh", avatar: "A" },
    avatar: "N",
  },
  personalDetails: {
    "Full Name": "Noura Al-Abdullah",
    Phone: "+966 55 123 4567",
    Email: "noura.abdullah@terra.com",
    "Date of Birth": "15 Mar 1995",
    Nationality: "Saudi",
    "Marital Status": "Married",
    Address: "Riyadh, Olaya District, Building 42",
  },
  documents: [
    { id: 1, name: "Employment_Contract.pdf", type: DocumentType.Pdf, size: "2.4 MB" },
    { id: 2, name: "ID_Card_Front.png", type: DocumentType.Image, size: "1.1 MB" },
    { id: 3, name: "Degree_Certificate.pdf", type: DocumentType.Pdf, size: "4.7 MB" },
    { id: 4, name: "Passport_Scan.pdf", type: DocumentType.Pdf, size: "3.2 MB" },
  ],
  employmentStatus: {
    joinDate: "Jan 15, 2023",
    tenure: "1 year 9 months",
    contractType: ContractType.FullTime,
    manager: { name: "Ahmed Al-Saleh", avatar: "A" },
  },
};

export const mockTasksFinanceData: TasksFinanceData = {
  payslip: {
    month: "October",
    year: 2023,
    basicSalary: 15000,
    bonuses: 3500,
    deductions: 1200,
    netAmount: 17300,
  },
  assignedTasks: [
    { id: 1, title: "Update Employee Handbook", dueDate: "Oct 28, 2023", status: TaskStatus.InProgress },
    { id: 2, title: "Prepare Q3 Evaluation", dueDate: "Oct 25, 2023", status: TaskStatus.Completed },
    { id: 3, title: "Coordinate Annual Workshop", dueDate: "Nov 5, 2023", status: TaskStatus.InProgress },
  ],
};

export const mockAttendanceData: AttendancePageData = {
  alertMessage: "Your leave request has been approved",
  pendingRequests: [
    { id: 1, type: "Sick Leave", from: "Oct 26, 2023", to: "Oct 26, 2023", reason: "Medical appointment", status: LeaveRequestStatus.Pending },
    { id: 2, type: "Annual Leave", from: "Nov 10, 2023", to: "Nov 14, 2023", reason: "Family trip", status: LeaveRequestStatus.Pending },
  ],
  recentLog: [
    { date: "Oct 24, 2023", checkIn: "08:05 AM", checkOut: "05:00 PM", totalHours: "8h 55m" },
    { date: "Oct 23, 2023", checkIn: "08:00 AM", checkOut: "05:00 PM", totalHours: "8h 00m" },
    { date: "Oct 22, 2023", checkIn: "08:15 AM", checkOut: "04:30 PM", totalHours: "8h 15m" },
    { date: "Oct 21, 2023", checkIn: "09:00 AM", checkOut: "05:00 PM", totalHours: "8h 00m" },
    { date: "Oct 20, 2023", checkIn: "08:00 AM", checkOut: "05:00 PM", totalHours: "8h 00m" },
  ],
};
