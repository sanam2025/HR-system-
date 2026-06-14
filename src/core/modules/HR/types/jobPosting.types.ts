// core/modules/HR/types/jobPosting.types.ts

export type JobPostingStatus = 'open' | 'closed';

export interface JobPosting {
  id: number;
  job_title: string;
  description: string;
  experience: number;
  skills: number[];
  status: JobPostingStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateJobPostingData {
  job_title: string;
  description: string;
  experience: number;
  skills: number[];
}

export interface UpdateJobPostingData extends Partial<CreateJobPostingData> {
  status?: JobPostingStatus;
}