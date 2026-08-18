// src/core/modules/HR/types/overtime.types.ts
export interface OvertimeRequest {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'mandatory' | 'voluntary';
  notes?: string;
  user?: {
    id: number;
    full_name: string;
    department?: string;
  };
}