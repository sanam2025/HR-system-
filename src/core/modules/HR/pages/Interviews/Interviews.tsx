// src/core/modules/HR/pages/Interviews/Interviews.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, FileText, Calendar, MapPin, Star, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useInterviews } from '../../hooks/useInterviews';
import { useSendOffer } from '../../hooks/useOffer';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import type { Interview } from '../../../../../api/service/HrService/Types/InterviewsService.types';
import { AxiosError } from 'axios';
import type { CreateOfferData } from '../../../../../api/service/HrService/Types/OfferService.types';

export default function Interviews() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const parsedJobId = parseInt(jobId || '0');

  const { interviews, isLoading, error, refetch } = useInterviews(parsedJobId);
  
  const sendOfferMutation = useSendOffer(parsedJobId);

  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [offerData, setOfferData] = useState({
    hour_price: 15,
    start_date: new Date().toISOString().split('T')[0],
    weekend_days: ['friday', 'saturday'],
    working_hour_per_day: 8, // سنقوم بتحويل الاسم عند الإرسال بناءً على الباك إند
  });

  const handleSendOffer = () => {
    if (!selectedCandidateId || !parsedJobId) return;

    // بناء الـ payload حسب ما يقبله الباك إند
    const payload = {
      candidate_id: selectedCandidateId, 
      hour_price: Number(offerData.hour_price),
      start_date: offerData.start_date,
      weekend_days: offerData.weekend_days,
      // استخدام الاسم الصحيح حسب ما يطلبه الباك إند (working_hours_per_day أو working_hour_per_day)
      working_hours_per_day: Number(offerData.working_hour_per_day) 
    };

    sendOfferMutation.mutate(payload as unknown as CreateOfferData, {
      onSuccess: () => {
        toast.success('🎉 Offer sent successfully!');
        setSelectedCandidateId(null);
        refetch(); // 🔄 تحديث الجدول: هذا سيجعل الزر يختفي فوراً لأن الباك إند الآن يعرف أن العرض أُرسل
      },
      onError: (err: unknown) => {
        if (err instanceof AxiosError && err.response?.status === 422) {
          console.log('🔴 422 Validation Error Details:', err.response.data);
          
          const errors = err.response.data as Record<string, string[]>;
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = errors[firstErrorKey]?.[0];
          if (firstErrorMessage) {
            toast.error(`❌ ${firstErrorMessage}`);
          } else {
            toast.error('❌ Validation error: Please check the offer data.');
          }
        } else {
          toast.error('❌ Failed to send offer. Please try again.');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i: Interview) => i.status === 'scheduled').length,
    completed: interviews.filter((i: Interview) => i.status === 'done' || i.status === 'completed').length,
    cancelled: interviews.filter((i: Interview) => i.status === 'cancelled').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <button
          onClick={() => navigate('/Hr/job-postings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage interviews for this job posting</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Scheduled At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Interviewer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {interviews.map((interview: Interview) => {
                // ✅ تحديد إذا كان المتقدم قد اجتاز المقابلة تماماً
                const isCompleted = interview.status === 'done' || interview.status === 'completed';
                const candidateId = interview.candidate?.id || interview.candidate_id;

                return (
                  <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                          {interview.candidate?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{interview.candidate?.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{interview.candidate?.email || ''}</div>
                          {interview.rank && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1 font-medium">
                              <Trophy className="w-3 h-3" /> Rank #{interview.rank}
                            </div>
                          )}
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
                      {isCompleted ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> done
                          </span>
                          {interview.rate && (
                            <span className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                              <Star className="w-3 h-3" /> Rate: {interview.rate}/10
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> {interview.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/Hr/interviews/${interview.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* ✅ المنطق الجديد: فقط إذا اجتاز المقابلة نعرض الزر */}
                      {isCompleted && candidateId && (
                        <button
                          onClick={() => setSelectedCandidateId(candidateId)}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <FileText className="w-4 h-4" /> Send Offer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {interviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No interviews found.</p>
          </div>
        )}
      </div>

      {/* Modal إرسال العرض */}
      {selectedCandidateId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Send Job Offer</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hour Price ($)</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={offerData.hour_price}
                  onChange={(e) => setOfferData({...offerData, hour_price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={offerData.start_date}
                  onChange={(e) => setOfferData({...offerData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours / Day</label>
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
                  Cancel
                </button>
                <button 
                  onClick={handleSendOffer} 
                  disabled={sendOfferMutation.isPending}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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