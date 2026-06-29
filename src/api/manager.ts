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
  return response.data;
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

// ── 3. طلبات الإجازات (Leave Requests) ──

/**
 * عرض طلبات إجازة القسم
 */
export async function getDepartmentLeaveRequests(status?: string) {
  let url = 'department-leave-request';
  if (status) {
    url += `?status=${encodeURIComponent(status)}`;
  }
  const response = await apiClient.get(url);
  return response.data?.data || response.data; // Handle pagination or nested data
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
  return response.data?.data || response.data;
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
  return response.data?.data || response.data;
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
