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
  complainant?: ComplaintUser;
  against?: ComplaintUser;
  response?: string;
  created_at: string;
  updated_at: string;
}