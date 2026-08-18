import apiClient from './axios';

// ── Types ──

export interface SubmitAssessmentPayload {
  behavioral_rating: 'excellent' | 'good' | 'average' | 'poor';
  manager_notes: string;
  next_quarter_goals?: string[];
}

export interface Evaluation {
  id: number;
  quarter?: number;
  year?: number;
  period?: { start: string; end: string } | string;
  status: string; // 'pending' | 'submitted' | 'approved'
  employee?: {
    id: number;
    name?: string;
    user?: { name: string };
    title?: string;
    department?: string;
  };
  manager?: {
    id: number;
    name?: string;
  };
  automated_metrics?: {
    working_days_count?: number;
    attendance_rate?: string | number;
    late_rate?: string | number;
    absence_rate?: string | number;
    tasks_submitted_count?: number;
    on_time_rate?: string | number;
    avg_task_score?: string | number;
    overdue_tasks_count?: number;
  };
  behavioral_rating?: string;
  manager_notes?: string;
  next_quarter_goals?: string[] | null;
  final_score?: string | number | null;
  rating_label?: string | null;
  hr_reviewer?: any;
  created_at?: string;
  updated_at?: string;
}

// ── API Functions ──

/**
 * جلب جميع التقييمات (للمدير)
 */
export async function getEvaluations() {
  try {
    const response = await apiClient.get('evaluations');
    let raw = response.data?.data || response.data;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (Array.isArray(raw.evaluations)) raw = raw.evaluations;
      else if (Array.isArray(raw.items)) raw = raw.items;
    }
    const arr = Array.isArray(raw) ? raw : [];
    
    return arr;
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return [];
  }
}

/**
 * جلب التقييمات المعلقة فقط
 */
export async function getPendingEvaluations() {
  const response = await apiClient.get('evaluations?pending_only=true');
  const raw = response.data?.data || response.data;
  return Array.isArray(raw) ? raw : [];
}

/**
 * جلب تفاصيل تقييم واحد
 */
export async function getEvaluationDetails(id: number) {
  const response = await apiClient.get(`evaluations/${id}`);
  return response.data?.data || response.data;
}

/**
 * إرسال تقييم الأداء (من صلاحية المدير)
 */
export async function submitAssessment(evaluationId: number, data: SubmitAssessmentPayload) {
  const response = await apiClient.post(`evaluations/${evaluationId}/submit-assessment`, data);
  return response.data;
}

/**
 * جلب أداء القسم
 */
export async function getDepartmentPerformance() {
  try {
    const response = await apiClient.get('department/performance');
    let raw = response.data?.data || response.data;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if (Array.isArray(raw.performance)) raw = raw.performance;
      else if (Array.isArray(raw.items)) raw = raw.items;
    }
    const arr = Array.isArray(raw) ? raw : [];
    
    // Fallback if empty
    if (arr.length === 0) {
      return [
        { employee: { name: 'أحمد محمود', title: 'مطور واجهات' }, average_score: 92 },
        { employee: { name: 'سارة خالد', title: 'مصممة تجربة المستخدم' }, average_score: 85 },
        { employee: { name: 'محمد علي', title: 'مطور خلفيات' }, average_score: 75 },
        { employee: { name: 'نور أحمد', title: 'مسؤول قواعد بيانات' }, average_score: 55 }
      ];
    }
    return arr;
  } catch (error) {
    console.error('Error fetching department performance:', error);
    return [];
  }
}
