// src/core/modules/HR/pages/JobPostings/JobPostingDetail.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, X } from 'lucide-react';
import { useJobPosting } from '../../hooks/useJobPostings';
import { apiClient } from '../../../../../api/client';
import Loading from '../../../../../shared/components/Loading';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  status: string;
  applied_at: string;
}

export default function JobPostingDetail() {
  const { lang, t } = useLanguage();
  const detailsLang = t.hrJobPostings?.details;

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');

  const { job, isLoading: jobLoading } = useJobPosting(jobId);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    scheduled_at: '',
    location_type: 'on_site',
    location_details: '',
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!jobId) return;
      setLoadingCandidates(true);
      try {
        const res = await apiClient.get(`/job-postings/${jobId}/candidates`);
        setCandidates(res.data?.data || []);
      } catch {
        toast.error(detailsLang?.errors?.loadCandidates || 'Failed to load candidates');
      } finally {
        setLoadingCandidates(false);
      }
    };
    fetchCandidates();
  }, [jobId]);

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !formData.scheduled_at) {
      toast.error(detailsLang?.errors?.fillRequired || 'Please fill in required fields');
      return;
    }

    try {
      await apiClient.post(`/job-postings/${jobId}/interviews`, {
        candidate_id: selectedCandidateId,
        interviewed_by: 1,
        scheduled_at: formData.scheduled_at,
        location_type: formData.location_type,
        location_details: formData.location_details,
      });
      toast.success(detailsLang?.success?.scheduleSuccess || 'Interview scheduled successfully!');
      setShowScheduleForm(false);
      setSelectedCandidateId(null);
      const res = await apiClient.get(`/job-postings/${jobId}/candidates`);
      setCandidates(res.data?.data || []);
    } catch {
      toast.error(detailsLang?.errors?.scheduleFail || 'Failed to schedule interview');
    }
  };

  if (jobLoading) return <Loading />;
  if (!job) return <p className="text-red-500">{detailsLang?.jobNotFound || 'Job not found'}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <button onClick={() => navigate('/Hr/job-postings')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
        <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {detailsLang?.back || 'Back'}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {job.department && (
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
            {lang === 'ar' ? 'القسم:' : 'Department:'} {job.department}
          </span>
        )}
        {job.status && (
          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${job.status === 'open' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            {lang === 'ar' ? 'الحالة:' : 'Status:'} {job.status === 'open' ? (lang === 'ar' ? 'مفتوح' : 'Open') : (lang === 'ar' ? 'مغلق' : 'Closed')}
          </span>
        )}
        {job.experience !== undefined && (
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">
            {lang === 'ar' ? 'الخبرة:' : 'Experience:'} {job.experience} {lang === 'ar' ? 'سنوات' : 'Years'}
          </span>
        )}
        {job.posted_at && (
          <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
            {lang === 'ar' ? 'تاريخ النشر:' : 'Posted At:'} {job.posted_at}
          </span>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">{lang === 'ar' ? 'المهارات المطلوبة:' : 'Required Skills:'}</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill: string, index: number) => (
              <span key={index} className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h4 className="font-semibold text-gray-800 mb-3">{lang === 'ar' ? 'الوصف الوظيفي:' : 'Job Description:'}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">{detailsLang?.applicants || 'Applicants'} ({candidates.length})</h3>
        </div>
        {loadingCandidates ? (
          <Loading />
        ) : candidates.length === 0 ? (
          <div className="p-12 text-center text-gray-400">{detailsLang?.noApplicants || 'No applicants yet.'}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{detailsLang?.table?.name || 'Name'}</th>
                <th className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{detailsLang?.table?.email || 'Email'}</th>
                <th className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{detailsLang?.table?.appliedAt || 'Applied At'}</th>
                <th className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{detailsLang?.table?.status || 'Status'}</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.applied_at}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${c.status === 'offered' ? 'bg-green-100 text-green-700' : c.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/*  الفورم المحسن */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{detailsLang?.scheduleForm?.title || 'Schedule Interview'}</h3>
              <button onClick={() => setShowScheduleForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{detailsLang?.scheduleForm?.dateLabel || 'Date & Time *'}</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{detailsLang?.scheduleForm?.typeLabel || 'Interview Type'}</label>
                <select
                  value={formData.location_type}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="on_site">{detailsLang?.scheduleForm?.typeOnSite || 'On-site'}</option>
                  <option value="remote">{detailsLang?.scheduleForm?.typeRemote || 'Remote'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{detailsLang?.scheduleForm?.detailsLabel || 'Location / Link Details *'}</label>
                <textarea
                  required
                  rows={3}
                  value={formData.location_details}
                  onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                  placeholder={detailsLang?.scheduleForm?.detailsPlaceholder || 'Enter meeting link or office location...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
                >
                  {detailsLang?.scheduleForm?.cancel || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {detailsLang?.scheduleForm?.confirm || 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}