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
