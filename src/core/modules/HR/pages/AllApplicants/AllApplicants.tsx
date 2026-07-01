// src/core/modules/HR/pages/AllApplicants/AllApplicants.tsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, XCircle } from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';
import ApplicantStats from './ApplicantStats';
import ApplicantFilters from './ApplicantFilters';
import ApplicantCard from './ApplicantCard';
import { useState, useMemo } from 'react';
import type { Candidate } from '../../../../../api/service/HrService/Types/CandidatesService.types';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';


export const AllApplicants = () => {
   const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') ? Number(searchParams.get('jobId')) : undefined;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { candidates, isLoading, error } = useCandidates(jobId);

  const getFullName = useMemo(() => (candidate: Candidate): string => {
    if (!candidate) return '';
    return candidate.full_name || '';
  }, []);

  const getEmail = useMemo(() => (candidate: Candidate): string => {
    if (!candidate) return '';
    return candidate.email || '';
  }, []);

  // ✅ معالج جدولة مقابلة
  const handleScheduleInterview = (candidateId: number) => {
    if (!jobId) {
      toast.error('No job associated with this candidate');
      return;
    }
    navigate(`/Hr/job-postings/${jobId}/interviews/schedule?candidateId=${candidateId}`);
  };

  // ✅ حالة عدم وجود متقدمين
  if ((candidates.length === 0 && !isLoading && !error) || error?.includes('404')) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <button
            onClick={() => navigate('/Hr/recruitment')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToRecruitment')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">All Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">No applicants found for this job posting</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No applicants have applied for this position yet.</p>
          <button 
            onClick={() => navigate('/Hr/recruitment')} 
            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
          >
            {t('backToRecruitment')}
          </button>
        </div>
      </div>
    );
  }

  // ✅ حالة الخطأ
  if (error && !error?.includes('404')) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <button
            onClick={() => navigate('/Hr/recruitment')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Recruitment
          </button>
          <h1 className="text-2xl font-bold text-gray-900">All Applicants</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">Error loading applicants: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // ✅ حالة التحميل
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <button
            onClick={() => navigate('/Hr/recruitment')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToRecruitment')}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('allApplicants')}</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-400 mt-4">({t('loadingApplicants')})</p>
        </div>
      </div>
    );
  }

  // ✅ حساب الإحصائيات
  const stats = {
    total: candidates.length,
    pending: candidates.filter((c: Candidate) => c.status === 'pending').length,
    reviewed: candidates.filter((c: Candidate) => c.status === 'reviewed').length,
    rejected: candidates.filter((c: Candidate) => c.status === 'rejected').length,
    interviewed: candidates.filter((c: Candidate) => (c.status as string) === 'interviewed').length,
    applied: candidates.filter((c: Candidate) => (c.status as string) === 'applied').length,
  };

  // ✅ فلترة المرشحين
  const filteredCandidates = candidates.filter((candidate: Candidate) => {
    const fullName = getFullName(candidate).toLowerCase();
    const email = getEmail(candidate).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = fullName.includes(search) || email.includes(search);
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/Hr/recruitment')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t('allApplicants')}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {candidates.length} applicants for this position
        </p>
      </div>

      <ApplicantStats stats={stats} />
      <ApplicantFilters
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate: Candidate) => (
                <ApplicantCard
                  key={candidate.id}
                  candidate={candidate}
                  jobId={jobId}
                  onScheduleInterview={handleScheduleInterview}
                />
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {t('noApplicantsMatchFilters')}
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

export default AllApplicants;