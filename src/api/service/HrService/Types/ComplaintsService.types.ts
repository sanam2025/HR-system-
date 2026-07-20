// src/api/service/HrService/Types/ComplaintsService.types.ts
export interface Complaint {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  subject_type: 'employee' | 'manager' | 'hr';
  complainant_id: number;
  complainant_name: string;
  complained_against_id: number;
  complained_against_name: string;
  complained_against_role: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  response?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateComplaintData {
  subject_id: number;
  title: string;
  description: string;
}

export interface UpdateComplaintStatusData {
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
}

export interface RespondComplaintData {
  response: string;
  status: 'resolved' | 'rejected';
}