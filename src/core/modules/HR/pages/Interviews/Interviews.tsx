// src/core/modules/HR/pages/Interviews/Interviews.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Eye, Calendar, MapPin, Star, Trophy, 
  CheckCircle, XCircle, Clock, FileText, Plus, X 
} from 'lucide-react';
import { useSendOffer } from '../../hooks/useOffer';
import { apiClient } from '../../../../../api/client';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import type { Interview } from '../../../../../api/service/HrService/Types/InterviewsService.types';

// تعريف نوع البيانات المحلية
interface LocalInterview extends Interview {
  job_title?: string;
}

export default function InterviewsDashboard() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<LocalInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالة الفورم (تنسيق مقابلة)
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({
    candidate_id: '',
    interviewed_by: '',
    scheduled_at: '',
    location_type: 'on_site',
    location_details: '',
  });

  // حالة الفورم (إرسال العرض)
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    candidate_id: 0,
    hour_price: 15,
    start_date: new Date().toISOString().split('T')[0],
    weekend_days: ['friday', 'saturday'],
    working_hour_per_day: 8,
  });

  const sendOfferMutation = useSendOffer();

  // جلب كل المقابلات من كل الوظائف
  const fetchAllInterviews = async () => {
    setIsLoading(true);
    try {
      // 1. جلب كل الوظائف
      const jobsRes = await apiClient.get('/HRjob-postings');
      const jobs = jobsRes.data?.data || [];

      // 2. لكل وظيفة، جلب مقابلاتها
      const allInterviews: LocalInterview[] = [];
      for (const job of jobs) {
        try {
          const res = await apiClient.get(`/job-postings/${job.id}/interviews`);
          const jobInterviews = res.data?.data || [];
          // إضافة اسم الوظيفة لكل مقابلة
          jobInterviews.forEach((interview: LocalInterview) => {
            interview.job_title = job.job_title;
          });
          allInterviews.push(...jobInterviews);
        } catch {
          // تم حذف error لأننا لا نستخدمه
          console.warn(`Failed to fetch interviews for job ${job.id}`);
        }
      }
      setInterviews(allInterviews);
    } catch {
      toast.error('Failed to load interviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInterviews();
  }, []);

  // دالة تنسيق مقابلة جديدة
  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.candidate_id || !formData.interviewed_by || !formData.scheduled_at) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const jobId = 1; // يمكنك تغييره حسب الحاجة
      await apiClient.post(`/job-postings/${jobId}/interviews`, {
        candidate_id: Number(formData.candidate_id),
        interviewed_by: Number(formData.interviewed_by),
        scheduled_at: formData.scheduled_at,
        location_type: formData.location_type,
        location_details: formData.location_details,
      });
      toast.success('Interview scheduled successfully!');
      setShowScheduleForm(false);
      fetchAllInterviews();
    } catch {
      toast.error('Failed to schedule interview');
    }
  };

  // دالة إرسال العرض (تفتح الفورم أولاً)
  const handleSendOfferClick = (candidateId: number) => {
    setOfferData({ ...offerData, candidate_id: candidateId });
    setShowOfferForm(true);
  };

  // تأكيد إرسال العرض
  const confirmSendOffer = () => {
    sendOfferMutation.mutate(offerData, {
      onSuccess: () => {
        toast.success('Offer sent successfully!');
        setShowOfferForm(false);
        fetchAllInterviews();
      },
    });
  };

  // دالة إنهاء الخدمة (الانتقال لصفحة Terminations)
  const handleGoToTerminations = () => {
    navigate('/Hr/terminations');
  };

  // حساب الإحصائيات
  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === 'scheduled').length,
    completed: interviews.filter((i) => i.status === 'done' || i.status === 'completed').length,
    cancelled: interviews.filter((i) => i.status === 'cancelled').length,
    pendingOffer: interviews.filter((i) => i.status === 'done' && !i.rank).length,
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate('/Hr')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Interviews & Offers Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all interviews, track rankings, and send offers.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScheduleForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" /> Schedule Interview
          </button>
          <button
            onClick={handleGoToTerminations}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <XCircle className="w-4 h-4" /> End Service
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Scheduled</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Ranked (Ready for Offer)</p>
            <p className="text-2xl font-bold text-purple-600">{stats.pendingOffer}</p>
          </div>
          <Trophy className="w-8 h-8 text-purple-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
      </div>

      {/* جدول المقابلات */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Scheduled At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Interviewer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {interviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{interview.job_title || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                        {interview.candidate?.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{interview.candidate?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{interview.candidate?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {interview.location_details || interview.location_type || 'On Site'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {interview.interviewer?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      interview.status === 'done' || interview.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : interview.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {interview.rank ? (
                        <span className="flex items-center gap-1 text-sm font-medium text-yellow-600">
                          <Trophy className="w-4 h-4" /> #{interview.rank}
                        </span>
                      ) : interview.rate ? (
                        <span className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="w-4 h-4" /> {interview.rate}/10
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {/* زر عرض التفاصيل */}
                    <button
                      onClick={() => navigate(`/Hr/interviews/${interview.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* زر إرسال العرض (يظهر فقط إذا كانت المقابلة مكتملة وتم التقييم) */}
                    {interview.status === 'done' && interview.rank && (
                      <button
                        onClick={() => handleSendOfferClick(interview.candidate_id || 0)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                      >
                        <FileText className="w-3 h-3" /> Send Offer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {interviews.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    No interviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ فورم تنسيق مقابلة */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
              <button onClick={() => setShowScheduleForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate ID *</label>
                <input
                  type="number"
                  value={formData.candidate_id}
                  onChange={(e) => setFormData({ ...formData, candidate_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer ID *</label>
                <input
                  type="number"
                  value={formData.interviewed_by}
                  onChange={(e) => setFormData({ ...formData, interviewed_by: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At *</label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                <select
                  value={formData.location_type}
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="on_site">On Site</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Details</label>
                <input
                  type="text"
                  value={formData.location_details}
                  onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button onClick={() => setShowScheduleForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ فورم إرسال العرض (لإدخال البيانات الناقصة) */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Send Job Offer</h3>
              <button onClick={() => setShowOfferForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hour Price ($) *</label>
                <input
                  type="number"
                  value={offerData.hour_price}
                  onChange={(e) => setOfferData({ ...offerData, hour_price: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={offerData.start_date}
                  onChange={(e) => setOfferData({ ...offerData, start_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours / Day *</label>
                <input
                  type="number"
                  value={offerData.working_hour_per_day}
                  onChange={(e) => setOfferData({ ...offerData, working_hour_per_day: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button onClick={() => setShowOfferForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={confirmSendOffer} disabled={sendOfferMutation.isPending} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {sendOfferMutation.isPending ? 'Sending...' : 'Confirm Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}