// src/core/modules/HR/pages/AcceptedCandidates/AcceptedCandidates.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronRight, ArrowLeft, CheckCircle, Mail, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../../../../../api/client';
import Loading from '../../../../../shared/components/Loading';

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  status: string;
  rank?: number;
  rate?: number;
}

interface JobPosting {
  id: number;
  job_title: string;
  candidates?: Candidate[];
}

interface RankingInfo {
  candidate_id: number;
  rank: number;
  rate: number;
}

export default function AcceptedCandidates() {
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const jobsRes = await apiClient.get('/HRjob-postings');
      const jobs = jobsRes.data?.data || [];

      const jobsWithCandidates = await Promise.all(
        jobs.map(async (job: JobPosting) => {
          try {
            // ✅ تغيير الـ API لجلب كل المتقدمين ثم فلترة المقبولين
            const candidatesRes = await apiClient.get(`/job-postings/${job.id}/candidates`);
            const rankingRes = await apiClient.get(`/job-postings/${job.id}/interviews/ranked-by-rate`);

            // فلترة المتقدمين الذين حالتهم 'accepted' أو 'passed'
            const acceptedCandidates = (candidatesRes.data?.data || []).filter(
              (c: Candidate) => c.status === 'accepted' || c.status === 'passed'
            );

            // إضافة الترتيب والتقييم من الـ Ranking API
            const rankingData = rankingRes.data?.data || [];
            const enhancedCandidates = acceptedCandidates.map((c: Candidate) => {
              const rankInfo = rankingData.find((r: RankingInfo) => r.candidate_id === c.id);
              return { ...c, rank: rankInfo?.rank, rate: rankInfo?.rate };
            });

            return { ...job, candidates: enhancedCandidates };
          } catch {
            return { ...job, candidates: [] };
          }
        })
      );

      setJobPostings(jobsWithCandidates);
    } catch {
      toast.error('Failed to load accepted candidates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <button
        onClick={() => navigate('/Hr')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Accepted Candidates</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review candidates who passed the interview, organized by job posting.
        </p>
      </div>

      {jobPostings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No job postings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div
                className="p-5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center"
                onClick={() => toggleExpand(job.id)}
              >
                <div>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    {job.job_title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {job.candidates?.length || 0} accepted candidates
                  </p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedJobId === job.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {expandedJobId === job.id && (
                <div className="divide-y divide-gray-50">
                  {job.candidates && job.candidates.length > 0 ? (
                    job.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-4 hover:bg-gray-50 transition-colors flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs">
                              {candidate.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{candidate.full_name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span>{candidate.email}</span>
                              </div>
                              {candidate.rank && (
                                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                                  <Award className="w-3 h-3" /> Rank #{candidate.rank} (Rate: {candidate.rate}/10)
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Passed
                            </span>
                            {/* ✅ زر جدولة المقابلة */}
                            <button
                              onClick={() => navigate(`/Hr/job-postings/${job.id}/interviews/schedule?candidateId=${candidate.id}`)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs mt-1"
                            >
                              <Calendar className="w-3 h-3" /> Schedule
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      No accepted candidates for this position yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}