// src/core/modules/HR/pages/JobPostings/JobPostingDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Briefcase, Clock, DollarSign, FileText } from 'lucide-react';
import { useJobPosting } from '../../hooks/useJobPostings';
import { useCandidates } from '../../hooks/useCandidates';
import Loading from '../../../../../shared/components/Loading';
import type { Candidate } from '../../../../../api/service/HrService/Types/CandidatesService.types';
import type { JobPosting } from '../../../../../api/service/HrService/Types/JobPostingsService.types';

interface Skill {
  id?: number;
  name?: string;
  skill_name?: string;
  level?: string;
}

interface JobPostingWithSalary extends JobPosting {
  salary?: string;
}

export const JobPostingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jobId = id ? Number(id) : undefined;

  const { job, isLoading: jobLoading, error: jobError } = useJobPosting(jobId);
  const { candidates, isLoading: candidatesLoading } = useCandidates(jobId);

  if (jobLoading || candidatesLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error loading job details</p>
          <button onClick={() => navigate('/Hr/job-postings')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Back to Job Postings
          </button>
        </div>
      </div>
    );
  }

  const jobWithSalary = job as JobPostingWithSalary;
  const skills = (job.skills || []) as (string | Skill)[];

  // ✅ تغيير الحالة من rejected إلى applied
  const displayCandidates = candidates?.map((candidate: Candidate) => ({
    ...candidate,
    displayStatus: candidate.status === 'rejected' ? 'applied' : candidate.status
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'applied': return 'bg-gray-100 text-gray-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillName = (skill: string | Skill): string => {
    if (typeof skill === 'string') return skill;
    return skill?.name || skill?.skill_name || '';
  };

  const getDisplayStatus = (candidate: Candidate & { displayStatus?: string }): string => {
    return candidate.displayStatus || candidate.status || 'N/A';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-6">
        <button
          onClick={() => navigate('/Hr/job-postings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.job_title}</h1>
            <p className="text-gray-500 mt-1">Job Posting Details</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/Hr/job-postings/${id}/interviews`)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              View Interviews
            </button>
            <button
              onClick={() => navigate(`/Hr/job-postings/${id}/offers`)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Offers
            </button>
            <button
              onClick={() => navigate(`/Hr/job-postings/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                {job.status || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-medium">{job.experience || 0}+ years</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Applicants</p>
              <p className="font-medium">{displayCandidates.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-medium">{jobWithSalary.salary || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
        <p className="text-gray-600">{job.description || 'No description provided'}</p>
      </div>

      {skills.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string | Skill, index: number) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {getSkillName(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Applicants ({displayCandidates.length || 0})</h3>
        </div>
        {displayCandidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayCandidates.map((candidate: Candidate & { displayStatus?: string }) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {candidate.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{candidate.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{candidate.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{candidate.experience || 0} years</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getDisplayStatus(candidate))}`}>
                        {getDisplayStatus(candidate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No applicants have applied for this position yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingDetail;