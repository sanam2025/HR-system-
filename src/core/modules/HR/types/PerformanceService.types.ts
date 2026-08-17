// src/api/service/HrService/Types/PerformanceService.types.ts
export interface PerformancePeriod {
  start: string;
  end: string;
}

export interface PerformanceAutomatedMetrics {
  working_days_count: number;
  attendance_rate: string;
  late_rate: string;
  absence_rate: string;
  tasks_submitted_count: number;
  on_time_rate: string;
  avg_task_score: string;
  overdue_tasks_count: number;
}

export interface PerformanceEmployee {
  id: number;
  name: string;
}

export interface PerformanceManager {
  id: number;
  name: string;
}

export interface PerformanceEvaluation {
  id: number;
  quarter: number;
  year: number;
  period: PerformancePeriod;
  status: 'pending_hr_review' | 'completed' | 'draft';
  automated_metrics?: PerformanceAutomatedMetrics;
  behavioral_rating: string;
  manager_notes: string | null;
  next_quarter_goals: string[];
  relevant_notes: unknown[];
  final_score: string;
  rating_label: string;
  hr_notes: string | null;
  employee: PerformanceEmployee;
  manager: PerformanceManager;
  hr_reviewer: unknown | null;
  created_at: string;
}