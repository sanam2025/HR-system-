// ── Mock data for MANAGER section ──

export const mockEmployees = [
  { id: 1, name: 'أحمد محمد الصالح', nameEn: 'Ahmed Mohamed Al-Saleh', title: 'مطور واجهات أمامية', titleEn: 'Frontend Developer', avatar: 'أ', avgRating: 4.5, todayStatus: 'حاضر', leaveBalance: 14, tasksCount: 3, phone: '0912345678', email: 'ahmed@hr.com', joinDate: '2022-01-15', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
  { id: 2, name: 'سارة علي حسن', nameEn: 'Sara Ali Hassan', title: 'مطورة واجهات خلفية', titleEn: 'Backend Developer', avatar: 'س', avgRating: 4.8, todayStatus: 'حاضر', leaveBalance: 10, tasksCount: 2, phone: '0923456789', email: 'sara@hr.com', joinDate: '2021-08-01', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
  { id: 3, name: 'محمد عمر إبراهيم', nameEn: 'Mohamed Omar Ibrahim', title: 'محلل أنظمة', titleEn: 'Systems Analyst', avatar: 'م', avgRating: 3.9, todayStatus: 'غائب', leaveBalance: 7, tasksCount: 1, phone: '0934567890', email: 'omar@hr.com', joinDate: '2023-03-20', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
  { id: 4, name: 'ليلى يوسف كريم', nameEn: 'Layla Youssef Karim', title: 'مصممة UX', titleEn: 'UX Designer', avatar: 'ل', avgRating: 4.2, todayStatus: 'حاضر', leaveBalance: 18, tasksCount: 4, phone: '0945678901', email: 'layla@hr.com', joinDate: '2020-11-10', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
  { id: 5, name: 'خالد سامي نور', nameEn: 'Khalid Sami Nour', title: 'مدير قواعد بيانات', titleEn: 'Database Manager', avatar: 'خ', avgRating: 4.0, todayStatus: 'تأخير', leaveBalance: 5, tasksCount: 2, phone: '0956789012', email: 'khalid@hr.com', joinDate: '2022-06-05', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
  { id: 6, name: 'نور بشار أمين', nameEn: 'Nour Bashar Amin', title: 'مطورة تطبيقات', titleEn: 'App Developer', avatar: 'ن', avgRating: 4.7, todayStatus: 'حاضر', leaveBalance: 12, tasksCount: 3, phone: '0967890123', email: 'nour@hr.com', joinDate: '2021-02-28', department: 'قسم تقنية المعلومات', departmentEn: 'IT Department' },
];

export const mockTasks = [
  { id: 1, title: 'تطوير واجهة لوحة التحكم', assigneeId: 1, assigneeName: 'أحمد محمد', status: 'قيد التنفيذ', priority: 'عالية', dueDate: '2026-05-20', description: 'بناء واجهة Dashboard للمشروع الجديد', rating: null, createdAt: '2026-05-01' },
  { id: 2, title: 'إصلاح أخطاء API التقارير', assigneeId: 2, assigneeName: 'سارة علي', status: 'جديدة', priority: 'متوسطة', dueDate: '2026-05-18', description: 'مراجعة وإصلاح endpoints التقارير', rating: null, createdAt: '2026-05-05' },
  { id: 3, title: 'تحديث قاعدة البيانات', assigneeId: 5, assigneeName: 'خالد سامي', status: 'مكتملة', priority: 'عالية', dueDate: '2026-05-10', description: 'ترقية schema وإضافة الجداول الجديدة', rating: 4, createdAt: '2026-04-25' },
  { id: 4, title: 'تصميم شاشات الموبايل', assigneeId: 4, assigneeName: 'ليلى يوسف', status: 'متأخرة', priority: 'عالية', dueDate: '2026-05-08', description: 'تصميم Figma لتطبيق الموبايل', rating: null, createdAt: '2026-04-20' },
  { id: 5, title: 'كتابة توثيق المشروع', assigneeId: 3, assigneeName: 'محمد عمر', status: 'قيد التنفيذ', priority: 'منخفضة', dueDate: '2026-05-25', description: 'توثيق كامل لـ API والمكونات', rating: null, createdAt: '2026-05-06' },
  { id: 6, title: 'مراجعة كود المصادقة', assigneeId: 6, assigneeName: 'نور بشار', status: 'مكتملة', priority: 'عالية', dueDate: '2026-05-12', description: 'Code review لنظام المصادقة', rating: 5, createdAt: '2026-04-30' },
  { id: 7, title: 'اختبار أداء النظام', assigneeId: 1, assigneeName: 'أحمد محمد', status: 'جديدة', priority: 'متوسطة', dueDate: '2026-05-22', description: 'Load testing وتحسين الأداء', rating: null, createdAt: '2026-05-07' },
];

export const mockLeaveRequests = [
  { id: 1, employeeId: 3, employeeName: 'محمد عمر إبراهيم', type: 'سنوية', from: '2026-05-15', to: '2026-05-20', days: 6, reason: 'إجازة عائلية', status: 'معلقة', leaveBalance: 7, requestDate: '2026-05-08' },
  { id: 2, employeeId: 5, employeeName: 'خالد سامي نور', type: 'مرضية', from: '2026-05-12', to: '2026-05-13', days: 2, reason: 'مراجعة طبية', status: 'معلقة', leaveBalance: 5, requestDate: '2026-05-09' },
  { id: 3, employeeId: 1, employeeName: 'أحمد محمد الصالح', type: 'طارئة', from: '2026-05-14', to: '2026-05-14', days: 1, reason: 'ظروف عائلية طارئة', status: 'معلقة', leaveBalance: 14, requestDate: '2026-05-10' },
  { id: 4, employeeId: 2, employeeName: 'سارة علي حسن', type: 'سنوية', from: '2026-06-01', to: '2026-06-07', days: 7, reason: 'سفر', status: 'موافقة', leaveBalance: 10, requestDate: '2026-05-02' },
  { id: 5, employeeId: 4, employeeName: 'ليلى يوسف كريم', type: 'بدون راتب', from: '2026-05-20', to: '2026-05-25', days: 6, reason: 'دراسة وامتحانات', status: 'مرفوضة', leaveBalance: 18, requestDate: '2026-05-07' },
];

export const mockOvertimeRequests = [
  { id: 1, employeeId: 1, employeeName: 'أحمد محمد الصالح', date: '2026-05-12', hours: 3, reason: 'إنهاء مهمة عاجلة', status: 'معلقة', requestDate: '2026-05-09' },
  { id: 2, employeeId: 6, employeeName: 'نور بشار أمين', date: '2026-05-13', hours: 2, reason: 'اجتماع مع العميل', status: 'معلقة', requestDate: '2026-05-10' },
  { id: 3, employeeId: 2, employeeName: 'سارة علي حسن', date: '2026-05-10', hours: 4, reason: 'إطلاق النسخة الجديدة', status: 'موافقة', requestDate: '2026-05-08' },
];

export const mockAttendance = [
  { date: '2026-05-11', checkIn: '08:05', checkOut: '17:00', status: 'حاضر', delay: 5, earlyLeave: 0 },
  { date: '2026-05-10', checkIn: '08:30', checkOut: '17:00', status: 'تأخير', delay: 30, earlyLeave: 0 },
  { date: '2026-05-09', checkIn: '08:00', checkOut: '17:00', status: 'حاضر', delay: 0, earlyLeave: 0 },
  { date: '2026-05-08', checkIn: null, checkOut: null, status: 'غائب', delay: 0, earlyLeave: 0 },
  { date: '2026-05-07', checkIn: '08:10', checkOut: '16:30', status: 'حاضر', delay: 10, earlyLeave: 30 },
  { date: '2026-05-06', checkIn: '08:00', checkOut: '17:00', status: 'حاضر', delay: 0, earlyLeave: 0 },
  { date: '2026-05-05', checkIn: '09:00', checkOut: '17:00', status: 'تأخير', delay: 60, earlyLeave: 0 },
];

export const mockCandidates = [
  { id: 1, name: 'رامي حسن خليل', position: 'مطور React', experience: 4, skills: ['React', 'TypeScript', 'Node.js'], interviewScore: 85, cvScore: 80, rank: null, notes: 'خبرة جيدة في المشاريع الكبيرة' },
  { id: 2, name: 'دانا سليم أحمد', position: 'مطور React', experience: 2, skills: ['React', 'CSS', 'JavaScript'], interviewScore: 78, cvScore: 75, rank: null, notes: 'مبادرة عالية وتعلم سريع' },
  { id: 3, name: 'باسم عادل عمر', position: 'مطور React', experience: 6, skills: ['React', 'Redux', 'GraphQL'], interviewScore: 90, cvScore: 88, rank: null, notes: 'خبرة واسعة ومهارات قيادية' },
  { id: 4, name: 'هنا محمد فاضل', position: 'مطور React', experience: 3, skills: ['React', 'Vue', 'Tailwind'], interviewScore: 72, cvScore: 70, rank: null, notes: 'تصميم ممتاز وانتباه للتفاصيل' },
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
  { month: 'يناير', avgRating: 4.1, attendance: 90 },
  { month: 'فبراير', avgRating: 4.3, attendance: 88 },
  { month: 'مارس', avgRating: 4.0, attendance: 85 },
  { month: 'أبريل', avgRating: 4.5, attendance: 92 },
  { month: 'مايو', avgRating: 4.4, attendance: 87 },
];
