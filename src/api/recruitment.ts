import apiClient from './axios';

export interface JobRequisitionPayload {
  job_title: string;
  description: string;
  experience: number;
  skills: any[]; // currently using strings or IDs
}

export interface CandidateResultPayload {
  rate: number;
  notes: string;
}

export interface CandidateRankingPayload {
  ranking: {
    interview_id: number;
    rank: number;
  }[];
}

// ── طلبات التوظيف (Job Requisitions) ──

export async function getJobRequisitions() {
  // يرجع طلبات التوظيف الخاصة بالمدير (كلها أو المعتمدة)
  const response = await apiClient.get('job-requisitions');
  return response.data;
}

export async function getSkills() {
  const response = await apiClient.get('skills');
  return Array.isArray(response.data) ? response.data : (response.data?.data || []);
}

export async function createSkill(name: string) {
  const response = await apiClient.post('skills', { name });
  return response.data?.data || response.data;
}

export async function getJobPostings() {
  const response = await apiClient.get('job-postings');
  return response.data;
}

export async function createJobRequisition(data: JobRequisitionPayload) {
  const response = await apiClient.post('job-requisitions', data);
  return response.data;
}

export async function updateJobRequisition(id: number, data: Partial<JobRequisitionPayload>) {
  const response = await apiClient.patch(`job-requisitions/${id}`, data);
  return response.data;
}

export async function deleteJobRequisition(id: number) {
  const response = await apiClient.delete(`job-requisitions/${id}`);
  return response.data;
}

// ── المقابلات والمرشحين (Interviews & Candidates) ──

export async function getMyInterviews() {
  const response = await apiClient.get('my-interviews');
  const raw = response.data;
  // API returns { data: [...] }
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export async function getInterviewCandidates(jobPostingId: number) {
  // المدير يجلب مقابلاته الخاصة ثم يفلتر حسب الوظيفة
  const response = await apiClient.get('my-interviews');
  const allInterviews = Array.isArray(response.data)
    ? response.data
    : (response.data?.data || []);

  // فلتر حسب job_posting_id إذا كان متوفراً في الـ response
  const filtered = allInterviews.filter((iv: any) =>
    iv.job_posting_id === jobPostingId ||
    iv.job_posting?.id === jobPostingId ||
    iv.jobPostingId === jobPostingId
  );

  // إذا ما في فلتر ناجح، ارجع الكل (fallback للمرشحين العامين)
  return filtered.length > 0 ? filtered : allInterviews;
}


export async function submitInterviewResult(interviewId: number, data: CandidateResultPayload) {
  // تحديث نتيجة المقابلة (تقييم المرشح)
  const response = await apiClient.patch(`interviews/${interviewId}/result`, data);
  return response.data;
}

export async function cancelInterview(interviewId: number) {
  const response = await apiClient.patch(`interviews/${interviewId}/cancel`);
  return response.data;
}

export async function submitCandidatesRanking(jobPostingId: number, data: CandidateRankingPayload) {
  // تقديم ترتيب المرشحين
  const response = await apiClient.post(`job-postings/${jobPostingId}/interviews/ranking`, data);
  return response.data;
}
