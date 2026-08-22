export interface ResignationEmployee {
  id: number;
  full_name: string;
  job_title: string | null;
}

export interface ResignationDocument {
  id: number;
  file_name?: string;
  file_path?: string;
}

export interface Resignation {
  id: number;
  type: 'with_notice' | 'immediate';
  reason: string;
  last_working_day: string | null;
  status: 'submitted' | 'classified' | 'contract_terminated';
  employee?: ResignationEmployee;
  hr_classification: 'mutual_consent' | 'breach_by_company' | 'breach_by_employee' | null;
  hr_classification_notes: string | null;
  notice_period_treatment: 'not_applicable' | 'compensate' | 'work_notice';
  classified_by: { id: number; full_name: string } | null;
  classified_at: string | null;
  manager_notified_at: string | null;
  contract_terminated_at: string | null;
  documents: ResignationDocument[];
  settlement: unknown | null;
  created_at: string;
}