import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, XCircle, FileText } from 'lucide-react';
import { useCandidates } from '../../hooks/useCandidates';
import { useSendOffer } from '../../hooks/useOffer';
import ApplicantStats from './ApplicantStats';
import ApplicantFilters from './ApplicantFilters';
import { useState, useMemo } from 'react';
import type { Candidate } from '../../../../../api/service/HrService/Types/CandidatesService.types';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const AllApplicants = () => {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId') ? Number(searchParams.get('jobId')) : undefined;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');  const { candidates, isLoading, error, refetch } = useCandidates(jobId);  const sendOfferMutation = useSendOffer(jobId);  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [offerData, setOfferData] = useState({
    hour_price: 15,
    start_date: new Date().toISOString().split('T')[0],
    weekend_days: ['friday', 'saturday'],
    working_hour_per_day: 8,
  });

  const getFullName = useMemo(() => (candidate: Candidate): string => {
    if (!candidate) return '';
    return candidate.full_name || '';
  }, []);

  const getEmail = useMemo(() => (candidate: Candidate): string => {
    if (!candidate) return '';
    return candidate.email || '';
  }, []);  const handleSendOffer = () => {
    if (!selectedCandidateId || !jobId) return;
    
    sendOfferMutation.mutate(
      { 
        candidate_id: selectedCandidateId, 
        ...offerData 
      },
      {
        onSuccess: () => {
          toast.success(' Offer sent successfully!');
          setSelectedCandidateId(null);
          refetch();
        },
      }
    );
  };

  if (!jobId) {
    return (
      <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <button onClick={() => navigate('/Hr/recruitment')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'جميع المتقدمين' : 'All Applicants'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isRTL ? 'لم يتم اختيار وظيفة' : 'No job selected'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{isRTL ? 'الرجاء اختيار إعلان وظيفة لعرض المتقدمين.' : 'Please select a job posting to view applicants.'}</p>
          <button onClick={() => navigate('/Hr/job-postings')} className="mt-4 text-blue-500 hover:text-blue-700 font-medium">
            {isRTL ? 'الذهاب لإعلانات الوظائف' : 'Go to Job Postings'}
          </button>
        </div>
      </div>
    );
  }

  if ((candidates.length === 0 && !isLoading && !error) || error?.includes('404')) {
    return (
      <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <button onClick={() => navigate('/Hr/recruitment')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'جميع المتقدمين' : 'All Applicants'}</h1>
          <p className="text-gray-500 text-sm mt-1">{isRTL ? 'لم يتم العثور على متقدمين لهذه الوظيفة' : 'No applicants found for this job posting'}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">{isRTL ? 'لم يتقدم أحد لهذه الوظيفة بعد.' : 'No applicants have applied for this position yet.'}</p>
          <button onClick={() => navigate('/Hr/recruitment')} className="mt-4 text-blue-500 hover:text-blue-700 font-medium">
            {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
        </div>
      </div>
    );
  }

  if (error && !error?.includes('404')) {
    return (
      <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <button onClick={() => navigate('/Hr/recruitment')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'جميع المتقدمين' : 'All Applicants'}</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">{isRTL ? 'خطأ في تحميل المتقدمين:' : 'Error loading applicants:'} {error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-500 hover:text-blue-700 font-medium">
            {isRTL ? 'المحاولة مرة أخرى' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mb-8">
          <button onClick={() => navigate('/Hr/recruitment')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'جميع المتقدمين' : 'All Applicants'}</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-gray-400 mt-4">{isRTL ? 'جاري تحميل المتقدمين...' : 'Loading applicants...'}</p>
        </div>
      </div>
    );
  }  const stats = {
    total: candidates.length,
    pending: candidates.filter((c: Candidate) => c.status === 'pending').length,
    reviewed: candidates.filter((c: Candidate) => c.status === 'reviewed').length,
    rejected: candidates.filter((c: Candidate) => c.status === 'rejected').length,
  };  const filteredCandidates = candidates.filter((candidate: Candidate) => {
    const fullName = getFullName(candidate).toLowerCase();
    const email = getEmail(candidate).toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(search) || email.includes(search);
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`p-6 bg-gray-50 min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <button onClick={() => navigate('/Hr/recruitment')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /> {isRTL ? 'العودة للتوظيف' : 'Back to Recruitment'}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isRTL ? 'جميع المتقدمين' : 'All Applicants'}</h1>
        <p className="text-gray-500 text-sm mt-1">{isRTL ? `${candidates.length} متقدمين لهذه الوظيفة` : `${candidates.length} applicants for this position`}</p>
      </div>

      <ApplicantStats stats={stats} />
      <ApplicantFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المتقدم' : 'Applicant'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'معلومات التواصل' : 'Contact'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'الخبرة' : 'Experience'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المهارات' : 'Skills'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'الحالة' : 'Status'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'تاريخ التقديم' : 'Applied Date'}</th>
                <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate: Candidate) => {                const hasPassed = candidate.status === 'accepted';

                return (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{candidate.full_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{candidate.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700" dir="ltr">
                      {isRTL ? `سنوات ${candidate.experience || '-'}` : `${candidate.experience || '-'} years`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {Array.isArray(candidate.skills) ? candidate.skills.join(', ') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium
                        ${candidate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {candidate.status === 'accepted' ? (isRTL ? 'مقبول (نجح)' : 'Accepted (Passed)') :
                         candidate.status === 'rejected' ? (isRTL ? 'مرفوض' : 'Rejected') :
                         candidate.status === 'pending' ? (isRTL ? 'قيد الانتظار' : 'Pending') :
                         candidate.status === 'reviewed' ? (isRTL ? 'تمت المراجعة' : 'Reviewed') :
                         candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">                      {candidate.applied_date ? new Date(candidate.applied_date).toLocaleDateString() : '-'}
                    </td>                    <td className={`px-6 py-4 flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                      {hasPassed ? (                        <button
                          onClick={() => setSelectedCandidateId(candidate.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <FileText className="w-4 h-4" /> {isRTL ? 'إرسال عرض' : 'Send Offer'}
                        </button>
                      ) : (                        <button
                          onClick={() => {
                            if (!jobId) {
                              toast.error(isRTL ? 'لا توجد وظيفة مرتبطة بهذا المتقدم' : 'No job associated with this candidate');
                              return;
                            }
                            navigate(`/Hr/job-postings/${jobId}/interviews/schedule?candidateId=${candidate.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {isRTL ? 'جدولة مقابلة' : 'Schedule Interview'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {isRTL ? 'لا يوجد متقدمين يطابقون تصفيتك' : 'No applicants match your filters'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>      {selectedCandidateId && (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{isRTL ? 'إرسال عرض عمل' : 'Send Job Offer'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'سعر الساعة ($)' : 'Hour Price ($)'}</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={offerData.hour_price}
                  onChange={(e) => setOfferData({...offerData, hour_price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'تاريخ البدء' : 'Start Date'}</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={offerData.start_date}
                  onChange={(e) => setOfferData({...offerData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isRTL ? 'ساعات العمل / يوم' : 'Working Hours / Day'}</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={offerData.working_hour_per_day}
                  onChange={(e) => setOfferData({...offerData, working_hour_per_day: Number(e.target.value)})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button 
                  onClick={() => setSelectedCandidateId(null)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  onClick={handleSendOffer} 
                  disabled={sendOfferMutation.isPending}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendOfferMutation.isPending ? (isRTL ? 'جاري الإرسال...' : 'Sending...') : (isRTL ? 'تأكيد العرض' : 'Confirm Offer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApplicants;