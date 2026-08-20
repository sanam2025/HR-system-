import { useState, useMemo } from 'react';
import { Send, Loader2, Star, Calendar, BarChart3, Clock, HeartHandshake, Users, Lightbulb, CheckCircle, XCircle, ListTodo, TrendingUp, AlertCircle, Target, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getEvaluations, getEvaluationDetails, submitAssessment, type Evaluation, type SubmitAssessmentPayload } from '../../../api/evaluation';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

export default function PeriodicEvaluation() {
  const { isRTL, t } = useLanguage();
  
  const [selectedEvalId, setSelectedEvalId] = useState<string>('');
  // Rating category
  const [ratings, setRatings] = useState({
    behavior: 0,
  });

  const [notes, setNotes] = useState('');
  const [goalsText, setGoalsText] = useState('');

  const { data: evaluations = [], isLoading } = useQuery<Evaluation[]>({
    queryKey: ['evaluations'],
    queryFn: getEvaluations,
  });

  const { data: evaluationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['evaluationDetails', selectedEvalId],
    queryFn: () => getEvaluationDetails(Number(selectedEvalId)),
    enabled: !!selectedEvalId,
  });

  const selectedEval = evaluations.find(e => e.id.toString() === selectedEvalId);
  const metrics = evaluationDetails?.automated_metrics;
  
  const periodText = selectedEval?.period 
    ? typeof selectedEval.period === 'string' 
      ? selectedEval.period 
      : `Q${selectedEval.quarter} ${selectedEval.year} (${selectedEval.period.start} - ${selectedEval.period.end})`
    : '';

  // Calculate average to map to API payload
  const averageRating = ratings.behavior;

  const submitMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubmitAssessmentPayload }) => submitAssessment(id, data),
    onSuccess: () => {
      toast.success(t.evaluation.successMsg);
      // Reset form
      setSelectedEvalId('');
      setRatings({ behavior: 0 });
      setNotes('');
      setGoalsText('');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.error || (isRTL ? 'فشل في إرسال التقييم' : 'Failed to submit evaluation');
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvalId) return toast.error(isRTL ? 'يرجى اختيار الموظف' : 'Please select an employee');
    if (Object.values(ratings).some(r => r === 0)) return toast.error(t.evaluation.errorIncomplete);
    
    // Map average rating to API enum
    let behavioral_rating: SubmitAssessmentPayload['behavioral_rating'] = 'poor';
    if (averageRating >= 4.5) behavioral_rating = 'excellent';
    else if (averageRating >= 3.5) behavioral_rating = 'good';
    else if (averageRating >= 2.5) behavioral_rating = 'average';

    submitMutation.mutate({
      id: Number(selectedEvalId),
      data: {
        behavioral_rating,
        manager_notes: notes,
        next_quarter_goals: goalsText.split('\n').map(g => g.trim()).filter(Boolean),
      }
    });
  };

  const handleStarClick = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const categories = [
    { id: 'behavior', label: t.evaluation.criteria.behavior, icon: <HeartHandshake size={18} className="text-amber-500" /> },
  ] as const;

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 pt-2 space-y-6">
      
      
      {/* Premium Header */}
      <div className={`bg-gradient-to-br from-green/5 via-emerald-50/30 to-transparent p-6 sm:p-8 rounded-3xl border border-green/10 shadow-sm flex flex-col sm:flex-row items-center sm:justify-between gap-4 relative overflow-hidden`}>
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-green/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className={`relative z-10 ${isRTL ? 'text-center sm:text-right' : 'text-center sm:text-left'}`}>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 tracking-tight">{t.evaluation.title}</h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium">{t.evaluation.subtitle}</p>
        </div>
        <div className="relative z-10 hidden sm:flex p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 rotate-3 hover:rotate-0 transition-transform duration-300">
          <Star className="w-10 h-10 text-green drop-shadow-sm" fill="#22c55e" fillOpacity={0.2} strokeWidth={1.5} />
        </div>
      </div>

      <div className="pt-4">
        {/* Decorative Top Border removed to blend with the page seamlessly */}
        
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Top Row: Date & Employee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`order-2 md:order-1 ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-2.5">{isRTL ? 'فترة التقييم' : 'Evaluation Period'} <span className="text-rose-500">*</span></label>
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  className={`w-full border border-slate-200 rounded-2xl py-3.5 text-sm focus:outline-none bg-slate-50/50 text-slate-500 font-semibold cursor-not-allowed transition-all ${isRTL ? 'pl-11 pr-5' : 'pr-11 pl-5'}`}
                  value={periodText}
                  placeholder={isRTL ? 'يتم تحديدها تلقائياً' : 'Determined automatically'}
                  dir="ltr"
                />
                <Calendar className={`absolute top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-green transition-colors ${isRTL ? 'left-4' : 'right-4'}`} size={18} />
              </div>
            </div>
            
            <div className={`order-1 md:order-2 ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
              <label className="block text-sm font-bold text-slate-700 mb-2.5">{t.evaluation.form.selectEmployee} <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select
                  className={`w-full border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-green/10 focus:border-green appearance-none bg-white text-slate-700 font-bold transition-all shadow-sm hover:border-slate-300 ${isRTL ? 'pl-11' : 'pr-11'}`}
                  value={selectedEvalId}
                  onChange={e => setSelectedEvalId(e.target.value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <option value="">{t.evaluation.form.selectPlaceholder}</option>
                  {isLoading ? (
                    <option disabled>{isRTL ? 'جاري التحميل...' : 'Loading...'}</option>
                  ) : (
                    evaluations.map(ev => {
                      const isEvaluated = ev.status !== 'pending' && ev.status !== 'draft';
                      return (
                        <option key={ev.id} value={ev.id}>
                          {ev.employee?.user?.name || ev.employee?.name || `موظف #${ev.id}`} {isEvaluated ? (isRTL ? '(تم التقييم مسبقاً)' : '(Already Evaluated)') : ''}
                        </option>
                      );
                    })
                  )}
                </select>
                <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Metrics Section */}
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-12 text-gray-400 border-t border-gray-100">
               <Loader2 className="animate-spin text-green" size={32} />
            </div>
          ) : metrics ? (
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-gray-400" size={20} />
                <h3 className="text-base font-extrabold text-gray-800">{isRTL ? 'المقاييس التلقائية من النظام' : 'Automated System Metrics'}</h3>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Metric 1 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 p-5 rounded-2xl border border-blue-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-blue-800 font-bold">{isRTL ? 'أيام العمل' : 'Working Days'}</span>
                    <div className="bg-white/60 text-blue-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <Calendar size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-blue-950">{metrics.working_days_count} <span className="text-sm font-semibold text-blue-700">{t.common.days}</span></span>
                </div>

                {/* Metric 2 */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 p-5 rounded-2xl border border-emerald-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-emerald-800 font-bold">{t.dashboard.attendanceRate}</span>
                    <div className="bg-white/60 text-emerald-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <CheckCircle size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-emerald-950">{metrics.attendance_rate}%</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100/40 p-5 rounded-2xl border border-amber-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-amber-800 font-bold">{isRTL ? 'معدل التأخير' : 'Late Rate'}</span>
                    <div className="bg-white/60 text-amber-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                      <Clock size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-amber-950">{metrics.late_rate}%</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/40 p-5 rounded-2xl border border-rose-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-rose-800 font-bold">{isRTL ? 'معدل الغياب' : 'Absence Rate'}</span>
                    <div className="bg-white/60 text-rose-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                      <XCircle size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-rose-950">{metrics.absence_rate}%</span>
                </div>

                {/* Metric 5 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 p-5 rounded-2xl border border-purple-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-purple-800 font-bold">{isRTL ? 'المهام المنجزة' : 'Completed Tasks'}</span>
                    <div className="bg-white/60 text-purple-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                      <ListTodo size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-purple-950">{metrics.tasks_submitted_count}</span>
                </div>

                {/* Metric 6 */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100/40 p-5 rounded-2xl border border-teal-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-teal-800 font-bold">{isRTL ? 'الالتزام بالوقت' : 'On-Time Rate'}</span>
                    <div className="bg-white/60 text-teal-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                      <TrendingUp size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-teal-950">{metrics.on_time_rate}%</span>
                </div>

                {/* Metric 7 */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 p-5 rounded-2xl border border-indigo-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-indigo-800 font-bold">{t.dashboard.avgRating}</span>
                    <div className="bg-white/60 text-indigo-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <Star size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-indigo-950">{metrics.avg_task_score}</span>
                </div>

                {/* Metric 8 */}
                <div className="bg-gradient-to-br from-red-50 to-red-100/40 p-5 rounded-2xl border border-red-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="block text-sm text-red-800 font-bold">{isRTL ? 'المهام المتأخرة' : 'Overdue Tasks'}</span>
                    <div className="bg-white/60 text-red-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <AlertCircle size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-red-950">{metrics.overdue_tasks_count}</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="border-t border-slate-100 pt-10">
            <div className={`flex items-center gap-3 mb-8 ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <Target className="text-slate-400" size={22} />
              </div>
              <h3 className="text-lg font-black text-slate-800">{isRTL ? 'التقييمات الفردية' : 'Individual Ratings'}</h3>
            </div>

            {/* Stars Ratings */}
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-gray-50/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                      {cat.icon}
                    </div>
                    <span className="text-sm font-extrabold text-gray-800">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(cat.id, star)}
                        className={`transition-all duration-200 hover:scale-110 p-1.5 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 ${ratings[cat.id] >= star ? 'text-amber-400' : 'text-gray-200'}`}
                      >
                        <Star fill={ratings[cat.id] >= star ? '#fbbf24' : 'none'} strokeWidth={ratings[cat.id] >= star ? 0 : 2} className={ratings[cat.id] >= star ? "text-amber-400 drop-shadow-sm" : "text-gray-300"} size={28} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-10">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <FileText className="text-slate-400" size={22} />
              </div>
              <label className="block text-lg font-black text-slate-800">{t.evaluation.form.notes}</label>
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-2xl p-5 text-sm focus:outline-none focus:ring-4 focus:ring-green/10 focus:border-green resize-none h-32 text-slate-700 bg-slate-50/30 font-medium transition-all shadow-sm placeholder:text-slate-400 hover:border-slate-300"
              placeholder={t.evaluation.form.notesPlaceholder}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="border-t border-slate-100 pt-10">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row' : 'flex-row'}`}>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <Lightbulb className="text-slate-400" size={22} />
              </div>
              <label className="block text-lg font-black text-slate-800">{isRTL ? 'أهداف الربع القادم' : 'Next Quarter Goals'}</label>
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-2xl p-5 text-sm focus:outline-none focus:ring-4 focus:ring-green/10 focus:border-green resize-none h-32 text-slate-700 bg-slate-50/30 font-medium transition-all shadow-sm placeholder:text-slate-400 hover:border-slate-300"
              placeholder={isRTL ? 'اكتب كل هدف في سطر جديد...' : 'Write each goal on a new line...'}
              value={goalsText}
              onChange={e => setGoalsText(e.target.value)}
            />
          </div>

          {(() => {
            const isEvaluated = selectedEval && selectedEval.status !== 'pending' && selectedEval.status !== 'draft';
            return (
              <button
                type="submit"
                disabled={submitMutation.isPending || isEvaluated}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white text-sm font-extrabold transition-all duration-300 shadow-md ${
                  isEvaluated ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-[#497b53] to-[#3d6645] hover:shadow-lg hover:-translate-y-0.5 hover:from-[#3d6645] hover:to-[#2e4d34] disabled:opacity-50 focus:ring-4 focus:ring-[#497b53]/30'
                }`}
              >
                {submitMutation.isPending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {isEvaluated ? (isRTL ? 'تم التقييم مسبقاً' : 'Already Evaluated') : t.evaluation.form.submit}
              </button>
            );
          })()}
        </form>
      </div>
    </div>
  );
}
