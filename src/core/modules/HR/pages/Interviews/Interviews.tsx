// src/core/modules/HR/pages/Interviews/Interviews.tsx
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import InterviewCard from './InterviewCard';
import InterviewStats from './InterviewStats';
import InterviewFilters from './InterviewFilters';
import { useState } from 'react';
import type { Interview } from '../../../../../api/service/HrService/Types/InterviewsService.types';

export const Interviews = () => {
  const navigate = useNavigate();
  const { jobId: jobIdFromParams } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const jobIdFromQuery = searchParams.get('jobId');
  
  const jobId = jobIdFromParams || jobIdFromQuery;
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    interviews,
    isLoading,
    error,
    cancelInterview,
    isUpdating,
  } = useInterviews(jobIdNumber);

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i: Interview) => i.status === 'scheduled').length,
    completed: interviews.filter((i: Interview) => i.status === 'completed').length,
    cancelled: interviews.filter((i: Interview) => i.status === 'cancelled').length,
  };

  const getCandidateName = (interview: Interview): string => {
    // @ts-expect-error - API قد يرجع كائن candidate كامل
    if (interview.candidate?.full_name) {
      // @ts-expect-error - API قد يرجع كائن candidate كامل
      return interview.candidate.full_name;
    }
    if (interview.candidate_id) {
      return `Candidate #${interview.candidate_id}`;
    }
    return '';
  };

  const filteredInterviews = interviews.filter((interview: Interview) => {
    const candidateName = getCandidateName(interview).toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = candidateName.includes(search);
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">Error loading interviews: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/Hr/job-postings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage interviews for this job posting
            </p>
          </div>
        </div>
      </div>

      <InterviewStats stats={stats} />
      <InterviewFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviewer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInterviews.map((interview: Interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onCancel={(id) => cancelInterview(id)}
                  isUpdating={isUpdating}
                  onViewDetails={() =>
                    navigate(`/Hr/interviews/${interview.id}`)
                  }
                />
              ))}
              {filteredInterviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No interviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Interviews;