// src/api/service/HrService/Types/ComplaintsService.types.ts

export interface ComplaintUser {
  id: number;
  full_name: string;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'under_review' | 'resolved' | 'rejected' | 'pending';
  complainant_id: number;
  against_id: number;
  // ✅ إضافة الحقول الناقصة
  author?: ComplaintUser;
  subject?: ComplaintUser;
  hr_note?: string;
  created_at: string;
  updated_at: string;
}

export interface RespondComplaintData {
  hr_note: string;
  status: 'under_review' | 'resolved' | 'rejected';
}

export interface CreateComplaintData {
  title: string;
  description: string;
  against_id: number;
}

export interface UpdateComplaintStatusData {
  status: 'under_review' | 'resolved' | 'rejected';
}