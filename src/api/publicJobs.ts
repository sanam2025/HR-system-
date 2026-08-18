import apiClient from './axios';

export async function getAvailableJobs() {
  const response = await apiClient.get('job-postings');
  return response.data;
}

export async function submitJobApplication(jobId: number, formData: FormData) {
  const response = await apiClient.post(`job-postings/${jobId}/apply`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
