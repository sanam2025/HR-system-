import apiClient from './axios';

// ── 1. إدارة الموظفين والملفات (Employees & Profiles) ──

/**
 * استعراض موظفي القسم الخاص بالمدير
 */
export async function getDepartmentEmployees(depId: number) {
  const response = await apiClient.get(`department/${depId}/employees`);
  return response.data;
}

/**
 * عرض الموظفين التابعين للمدير الحالي مباشرة
 */
export async function getManagerEmployees() {
  const response = await apiClient.get('manager-employees');
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.employees)) return raw.employees;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

/**
 * البحث عن موظف محدد ضمن فريق المدير
 */
export async function searchManagerEmployees(searchQuery: string) {
  const response = await apiClient.get(`search-manager-employees?search=${encodeURIComponent(searchQuery)}`);
  return response.data;
}

/**
 * عرض الملف الشخصي لأحد الموظفين التابعين له
 */
export async function getEmployeeProfile(employeeId: number) {
  const response = await apiClient.get(`profiles/${employeeId}`);
  return response.data;
}

export async function getEmployeeContract(employeeId: number) {
  const response = await apiClient.get(`employees/${employeeId}/contract`);
  return response.data;
}

export async function getEmployeeDocuments(employeeId: number) {
  const response = await apiClient.get(`employees/${employeeId}/documents`);
  return response.data;
}

export function getEmployeeContractDownloadUrl(employeeId: number) {
  return `${apiClient.defaults.baseURL}employees/${employeeId}/contract/download`;
}

export function getEmployeeDocumentDownloadUrl(employeeId: number, documentId: number) {
  return `${apiClient.defaults.baseURL}my-documents/${documentId}/download`; // As per Postman, although maybe it requires token in header. If it's a GET, we can fetch it.
}

export async function getEmployeePerformanceSummary(employeeId: number) {
  const response = await apiClient.get(`summary-performance/users/${employeeId}`);
  return response.data;
}

/**
 * عرض الملف الشخصي للمدير الحالي
 */
export async function getMyProfile() {
  try {
    const response = await apiClient.get('profiles');
    if (response.data && response.data.success === false) {
      return null; // لا يوجد بروفايل بعد
    }
    return response.data?.data || response.data || null;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

/**
 * حفظ الملف الشخصي للمدير (إنشاء إذا لم يكن موجوداً، أو تعديل إذا كان موجوداً)
 */
export async function saveMyProfile(id: number | null | undefined, data: FormData) {
  if (id) {
    // تعديل ملف موجود
    const response = await apiClient.post(`profiles/${id}?_method=PUT`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } else {
    // إنشاء ملف جديد
    const response = await apiClient.post(`profiles`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

// ── 2. متابعة الحضور والانصراف للقسم (Attendance) ──

/**
 * تحليل تفصيلي لحضور اليوم الخاص بقسم المدير
 */
export async function getAttendanceTodayAnalysis() {
  const response = await apiClient.get('attendance-today-analysis');
  return response.data;
}

/**
 * تصفية/فلترة سجلات الحضور لموظفي القسم
 */
export async function getAttendanceFilter(params: { from: string, to: string, status?: string, dep_id?: number }) {
  let url = `attendance-filter?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`;
  if (params.status && params.status !== 'all') {
    url += `&status=${encodeURIComponent(params.status)}`;
  }
  if (params.dep_id) {
    url += `&dep_id=${params.dep_id}`;
  }
  const response = await apiClient.get(url);
  return response.data;
}

/**
 * سجل حضور اليوم لجميع موظفي القسم
 */
export async function getAttendanceToday() {
  const response = await apiClient.get('attendance-today');
  const raw = response.data?.data || response.data;
  return Array.isArray(raw) ? raw : [];
}

/**
 * الحضور الشهري للمدير الحالي
 */
export async function getMyMonthlyAttendance() {
  const response = await apiClient.get('my-monthly-attendance');
  const raw = response.data?.data || response.data;
  return Array.isArray(raw) ? raw : [];
}

// ── 3. طلبات الإجازات (Leave Requests) ──

/**
 * عرض طلبات إجازة القسم
 */
export async function getDepartmentLeaveRequests(status?: string) {
  let url = 'department-leave-request';
  if (status && status !== 'all') {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  const raw = response.data;
  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (Array.isArray(raw?.data)) arr = raw.data;
  else if (Array.isArray(raw?.data?.data)) arr = raw.data.data;
  else if (Array.isArray(raw?.leave_requests)) arr = raw.leave_requests;
  else if (Array.isArray(raw?.requests)) arr = raw.requests;
  else if (Array.isArray(raw?.department_leaves)) arr = raw.department_leaves;

  return arr;
}

/**
 * الموافقة على طلب إجازة
 */
export async function approveLeaveRequest(id: number) {
  const response = await apiClient.put(`leave-requests/${id}/approve`);
  return response.data;
}

/**
 * رفض طلب إجازة
 */
export async function rejectLeaveRequest(id: number) {
  const response = await apiClient.put(`leave-requests/${id}/reject`);
  return response.data;
}

/**
 * عرض طلبات إجازة المدير الشخصية
 */
export async function getMyLeaveRequests(status?: string) {
  let url = 'leaveRequests';
  if (status && status !== 'all') {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

/**
 * تقديم طلب إجازة للمدير نفسه
 */
export async function submitLeaveRequest(data: { start_date: string; type: string; days_count: number; reason?: string }) {
  const formData = new FormData();
  formData.append('start_date', data.start_date);
  formData.append('type', data.type);
  formData.append('days_count', data.days_count.toString());
  if (data.reason) {
    formData.append('reason', data.reason);
  }
  
  const response = await apiClient.post('leaveRequests', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * رصيد إجازات المدير
 */
export async function getMyLeaveBalance() {
  const response = await apiClient.get('my-leave-balance');
  return response.data?.data || response.data;
}

// ── 4. طلبات الإجازات بالساعة (Hourly Leave Requests / المغادرات) ──

/**
 * عرض طلبات المغادرة (بالساعة) للقسم
 */
export async function getDepartmentHourlyLeaveRequests(status?: string) {
  let url = 'department-hourly-leave-request';
  if (status && status !== 'all') {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  const raw = response.data;
  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (Array.isArray(raw?.data)) arr = raw.data;
  else if (Array.isArray(raw?.data?.data)) arr = raw.data.data;
  else if (Array.isArray(raw?.hourly_leaves)) arr = raw.hourly_leaves;
  else if (Array.isArray(raw?.requests)) arr = raw.requests;

  return arr;
}

/**
 * الموافقة على طلب مغادرة بالساعة
 */
export async function approveHourlyLeaveRequest(id: number) {
  const response = await apiClient.put(`hourly-leave-requests/${id}/approve`);
  return response.data;
}

/**
 * رفض طلب مغادرة بالساعة
 */
export async function rejectHourlyLeaveRequest(id: number) {
  const response = await apiClient.put(`hourly-leave-requests/${id}/reject`);
  return response.data;
}

/**
 * عرض طلبات المغادرة (بالساعة) للمدير نفسه
 */
export async function getMyHourlyLeaveRequests(status?: string) {
  let url = 'hourly-leave-Requests';
  if (status && status !== 'all') {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  return response.data?.data || response.data;
}

/**
 * تقديم طلب مغادرة (بالساعة) للمدير نفسه
 */
export async function submitHourlyLeaveRequest(data: { date: string; start_time: string; end_time: string; reason: string }) {
  const formData = new FormData();
  formData.append('date', data.date);
  formData.append('start_time', data.start_time);
  formData.append('end_time', data.end_time);
  formData.append('reason', data.reason);
  
  const response = await apiClient.post('hourly-leave-Requests', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

// ── 5. تسجيل الحضور والانصراف (Check-in/out) ──

/**
 * تسجيل الحضور
 */
export async function submitCheckIn(data?: { latitude: number, longitude: number }) {
  const response = await apiClient.put('check-in', data);
  return response.data;
}

/**
 * تسجيل الانصراف
 */
export async function submitCheckOut(data?: { latitude: number, longitude: number }) {
  const response = await apiClient.put('check-out', data);
  return response.data;
}

// ── 6. الإشعارات (Notifications) ──

/**
 * جلب جميع إشعارات المستخدم
 */
export async function getMyNotifications() {
  const response = await apiClient.get('notifications');
  return response.data?.data || response.data;
}

/**
 * تعليم إشعار كمقروء
 */
export async function markNotificationAsRead(id: number) {
  const response = await apiClient.post(`notifications/${id}/read`);
  return response.data;
}

// ── 7. العطل الرسمية (Holidays) ──

/**
 * جلب قائمة العطل الرسمية
 */
export async function getHolidays() {
  const response = await apiClient.get('holidays');
  return response.data?.data || response.data;
}

// ── 8. العمل الإضافي (Overtime) ──

/**
 * جلب طلبات العمل الإضافي لجميع موظفي القسم (التطوعية)
 */
export async function getDepartmentOvertimeRequests() {
  const response = await apiClient.get('my-department-overtime');
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.overtimes)) return raw.overtimes;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

/**
 * قبول طلب عمل إضافي تطوعي من قبل المدير
 */
export async function approveOvertimeRequest(id: number) {
  const response = await apiClient.put(`voluntary-overtime/${id}/approve`);
  return response.data;
}

/**
 * رفض طلب عمل إضافي تطوعي من قبل المدير
 */
export async function rejectOvertimeRequest(id: number) {
  const response = await apiClient.put(`voluntary-overtime/${id}/reject`);
  return response.data;
}

/**
 * تكليف إضافي لموظف من قبل المدير
 */
export async function createManagerOvertime(data: { user_id: number; date: string; start_time: string; end_time: string; notes?: string }) {
  const formData = new FormData();
  formData.append('user_id', data.user_id.toString());
  formData.append('date', data.date);
  formData.append('start_time', data.start_time);
  formData.append('end_time', data.end_time);
  if (data.notes) formData.append('notes', data.notes);

  const response = await apiClient.post('store-overtime-bymanager', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * التكاليف الإضافية التي أنشأها المدير لموظفيه
 */
export async function getMyCreatedOvertimesManager() {
  const response = await apiClient.get('my-created-overtime-manager');
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.overtimes)) return raw.overtimes;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

/**
 * ساعات العمل الإضافي الخاصة بالمدير شخصياً
 */
export async function getMyOvertimes() {
  const response = await apiClient.get('my-overtimes');
  const raw = response.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  if (Array.isArray(raw?.overtimes)) return raw.overtimes;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

/**
 * تقديم طلب عمل إضافي تطوعي للمدير نفسه
 */
export async function createEmployeeOvertime(data: { date: string; start_time: string; end_time: string; notes?: string }) {
  const formData = new FormData();
  formData.append('date', data.date);
  formData.append('start_time', data.start_time);
  formData.append('end_time', data.end_time);
  if (data.notes) formData.append('notes', data.notes);

  const response = await apiClient.post('store-overtime-byemployee', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * إلغاء/حذف طلب عمل إضافي
 */
export async function deleteOvertimeRequest(id: number) {
  const response = await apiClient.delete(`delete-overtime/${id}/request`);
  return response.data;
}

// ── 9. إحصائيات لوحة التحكم والمهام (Dashboard Stats & Tasks) ──

/**
 * إحصائيات أعداد الموظفين والمدراء
 */
export async function getUsersCount() {
  const response = await apiClient.get('users/count');
  return response.data?.data || response.data;
}

/**
 * إحصائية تقييم أداء القسم الشهري
 */
export async function getDepartmentPerformance() {
  const response = await apiClient.get('dep-performance');
  return response.data?.data || response.data;
}

/**
 * عدد المهام المنجزة خلال الشهر الحالي
 */
export async function getCompletedTasksCountThisMonth() {
  try {
    const response = await apiClient.get('counttasks/completed-count-this-month');
    return response.data?.data || response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null; // الـ endpoint غير موجود بعد
    throw error;
  }
}

/**
 * قائمة جميع المهام المعلقة/الحالية
 */
export async function getTasks() {
  const response = await apiClient.get('tasks');
  const raw = response.data?.data || response.data;
  return Array.isArray(raw) ? raw : [];
}

