import apiClient from './axios';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assigned_to: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string;
}

export interface ReviewSubmissionPayload {
  status: 'approved' | 'rejected';
  score?: number;
  comment?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string; // 'pending' | 'in_progress' | 'submitted' | 'completed' | 'cancelled'
  priority: string;
  due_date: string;
  created_at?: string;
  assigned_to?: number;
  assignee?: {
    id: number;
    name?: string;
    user?: { name: string };
  };
  submission?: {
    id: number;
    status: string;
    score?: number;
    comment?: string;
  };
  latest_submission?: {
    id: number;
    task_id: number;
    notes?: string;
    attachment_url?: string;
    review?: any;
    created_at?: string;
  };
}

/**
 * جلب جميع المهام (للمدير والموظف)
 * يمكن التصفية بـ status مثل: pending, in_progress, submitted, completed
 */
export async function getTasks(status?: string) {
  let url = 'tasks';
  if (status) url += `?status=${encodeURIComponent(status)}`;
  const response = await apiClient.get(url);
  return Array.isArray(response.data) ? response.data : (response.data?.data || []);
}

/**
 * جلب تفاصيل مهمة واحدة
 */
export async function getTask(id: number) {
  const response = await apiClient.get(`tasks/${id}`);
  return response.data?.data || response.data;
}

/**
 * إنشاء مهمة جديدة (من صلاحية المدير)
 */
export async function createTask(data: CreateTaskPayload) {
  const response = await apiClient.post('tasks', data);
  return response.data;
}

/**
 * إلغاء مهمة (من صلاحية المدير)
 */
export async function cancelTask(id: number) {
  const response = await apiClient.get(`tasks/${id}/cancel`);
  return response.data;
}

/**
 * مراجعة تسليم مهمة (approve / reject) من صلاحية المدير
 */
export async function reviewTaskSubmission(submissionId: number, data: ReviewSubmissionPayload) {
  const response = await apiClient.post(`task-submissions/${submissionId}/review`, data);
  return response.data;
}

/**
 * إحصائيات عدد المهام المكتملة هذا الشهر
 */
export async function getCompletedTasksCount() {
  try {
    const response = await apiClient.get('counttasks/completed-count-this-month');
    return response.data?.data || response.data || { count: 0 };
  } catch (err: any) {
    if (err?.response?.status === 404) return { count: 0 };
    throw err;
  }
}

/**
 * تحميل المرفق بأمان (مع إرسال توكن المصادقة)
 */
export async function downloadAttachment(url: string) {
  const response = await apiClient.get(url, { responseType: 'blob' });
  return response.data;
}

/**
 * جلب الموظفين التابعين للمدير (لقائمة الإسناد)
 */
export async function getManagerEmployeesForTasks() {
  const response = await apiClient.get('manager-employees');
  const raw = response.data?.data || response.data;
  return Array.isArray(raw) ? raw : [];
}
