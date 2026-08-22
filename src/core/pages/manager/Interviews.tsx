import { useState } from 'react';
import { CalendarClock, Star, Clock, XCircle, CheckCircle, Video, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyInterviews, submitInterviewResult, cancelInterview } from '../../../api/recruitment';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

export default function Interviews() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<number | null>(null);
  const [candidateProfileId, setCandidateProfileId] = useState<number | null>(null);
  const [rateValue, setRateValue] = useState(0);
  const [notes, setNotes] = useState('');

  const { data: myInterviews = [], isLoading: myInterviewsLoading } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: getMyInterviews
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelInterview(id),
    onSuccess: () => {
      toast.success('تم إلغاء المقابلة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['my-interviews'] });
    },
    onError: () => toast.error('فشل في إلغاء المقابلة')
  });

  const handleCancel = (id: number) => {
    if (confirm('هل أنت متأكد من إلغاء هذه المقابلة؟')) {
      cancelMutation.mutate(id);
    }
  };

  const rateMutation = useMutation({
    mutationFn: ({ id, rate, notes }: { id: number; rate: number; notes: string }) => submitInterviewResult(id, { rate, notes }),
    onSuccess: () => {
      toast.success('تم تقييم المقابلة بنجاح');
      setRatingModalOpen(false);
      setSelectedInterview(null);
      setRateValue(0);
      setNotes('');
      queryClient.invalidateQueries({ queryKey: ['my-interviews'] });
    },
    onError: () => toast.error('فشل في إرسال التقييم')
  });

  const handleRate = async () => {
    if (!selectedInterview) return;
    if (rateValue === 0) {
      toast.error('يرجى تحديد التقييم');
      return;
    }
    rateMutation.mutate({ id: selectedInterview, rate: rateValue, notes });
  };

  const openRatingModal = (id: number) => {
    setSelectedInterview(id);
    setRateValue(0);
    setNotes('');
    setRatingModalOpen(true);
  };

  if (myInterviewsLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-green" size={30} /></div>;
  }

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
          <CalendarClock className="text-green" />
          مقابلاتي
        </h2>
        <p className="text-sm text-brown mt-1">إدارة المقابلات المجدولة وتقييم المرشحين</p>
      </div>

      {myInterviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500 shadow-card">
          لا توجد مقابلات مجدولة لك حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-card transition-all hover:shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 -ml-1.5 rounded-xl transition-colors"
                    onClick={() => interview.candidate_id && setCandidateProfileId(interview.candidate_id)}
                    title="عرض تفاصيل المرشح"
                  >
                    <div className="w-10 h-10 rounded-full bg-green/10 text-green flex items-center justify-center font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-sm hover:text-green transition-colors">
                        {interview.candidate?.first_name} {interview.candidate?.last_name}
                      </h3>
                      <p className="text-xs text-brown">{interview.candidate?.position || 'مرشح'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${interview.status === 'completed' ? 'bg-green/10 text-green' :
                    interview.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                    {interview.status === 'completed' ? 'مكتملة' :
                      interview.status === 'cancelled' ? 'ملغاة' : 'مجدولة'}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span>{interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleString('ar-EG') : 'موعد غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video size={14} className="text-gray-400" />
                    <span className="text-blue-600 underline cursor-pointer">رابط المقابلة (افتراضي)</span>
                  </div>
                </div>

                {interview.rate && (
                  <div className="mt-4 flex items-center gap-1 text-amber-500 bg-amber-50 w-fit px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                    <Star size={14} fill="currentColor" />
                    <span>التقييم: {interview.rate}/10</span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-2 pt-4 border-t border-gray-100">
                {interview.status !== 'cancelled' && (
                  <>
                    <button
                      onClick={() => openRatingModal(interview.id)}
                      className="flex-1 bg-green/10 text-green hover:bg-green/20 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14} /> تقييم
                    </button>
                    <button
                      onClick={() => handleCancel(interview.id)}
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={14} /> إلغاء
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-dark mb-4">تقييم المقابلة</h3>
            <p className="text-sm text-brown mb-4">ما هو تقييمك العام للمرشح من 10؟</p>

            <input
              type="number"
              min="1"
              max="10"
              value={rateValue || ''}
              onChange={(e) => setRateValue(Number(e.target.value))}
              className="form-input w-full mb-4 text-center text-lg font-bold"
              placeholder="مثال: 8"
            />

            <label className="text-sm font-semibold text-dark mb-2 block">ملاحظات المقابلة</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input w-full h-24 mb-6"
              placeholder="أضف ملاحظاتك حول أداء المرشح، نقاط القوة والضعف..."
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={handleRate}
                disabled={rateMutation.isPending}
                className="btn btn-primary flex-1 disabled:opacity-50 flex justify-center items-center"
              >
                {rateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'حفظ التقييم'}
              </button>
              <button
                onClick={() => setRatingModalOpen(false)}
                className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 flex-1"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

