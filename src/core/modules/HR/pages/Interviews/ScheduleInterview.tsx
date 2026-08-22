import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const ScheduleInterview = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { jobId: jobIdFromParams } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const candidateIdFromUrl = searchParams.get('candidateId');
  const jobIdFromQuery = searchParams.get('jobId');
  
  const jobId = jobIdFromParams || jobIdFromQuery;
  const jobIdNumber = jobId ? Number(jobId) : undefined;
  
  const { scheduleInterview, isScheduling } = useInterviews(jobIdNumber);  const [form, setForm] = useState({
    scheduled_at: '',
    location_type: 'on_site',
    location_details: '',
  });  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 5 || day === 6;
  };

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as { message?: string };
      return data?.message || err.message || 'Failed to schedule interview';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Failed to schedule interview';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.scheduled_at) {
      toast.error(lang === 'ar' ? 'يرجى اختيار التاريخ والوقت' : 'Please select a date and time');
      return;
    }
    
    if (isWeekend(form.scheduled_at)) {
      toast.error(lang === 'ar' ? 'لا يمكن تحديد مقابلات في عطلة نهاية الأسبوع (الجمعة، السبت)' : 'Interviews cannot be scheduled on weekends (Friday, Saturday)');
      return;
    }    const data = {
      candidate_id: Number(candidateIdFromUrl || 1),
      interviewed_by: 4, //  تلقائي
      scheduled_at: form.scheduled_at,
      location_type: form.location_type,
      location_details: form.location_details || '',
    };
    
    console.log(' Sending data:', data);
    
    scheduleInterview(data, {
      onSuccess: () => {
        if (jobId) {
          navigate(`/Hr/job-postings/${jobId}/interviews`);
        } else {
          navigate('/Hr/interviews');
        }
      },
      onError: (err) => {
        console.error(' Schedule error:', err);
        toast.error(getErrorMessage(err));
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => {
              if (jobId) {
                navigate(`/Hr/job-postings/${jobId}/interviews`);
              } else {
                navigate('/Hr/interviews');
              }
            }}
            className={`flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3 ${lang === 'ar' ? 'flex-row-reverse w-fit' : ''}`}
          >
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {lang === 'ar' ? 'العودة للمقابلات' : 'Back to Interviews'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{lang === 'ar' ? 'تحديد موعد مقابلة' : 'Schedule Interview'}</h1>
          <p className="text-gray-500 text-sm mt-1">{lang === 'ar' ? 'جدولة مقابلة جديدة لهذه الوظيفة' : 'Schedule a new interview for this job posting'}</p>

        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">            {candidateIdFromUrl && (
              <div className="hidden">
                <input
                  type="number"
                  name="candidate_id"
                  value={candidateIdFromUrl}
                  readOnly
                />
              </div>
            )}            <div className="hidden">
              <input
                type="number"
                name="interviewed_by"
                value="4"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{lang === 'ar' ? 'التاريخ والوقت المجدول *' : 'Scheduled Date & Time *'}</label>
              <div className="relative">
                <Calendar className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleChange}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:ring-green/30 focus:border-green transition-all duration-150`}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{lang === 'ar' ? 'اختر يوم عمل (الأحد - الخميس، تجنب الجمعة/السبت)' : 'Choose a weekday (Sunday - Thursday, avoid Friday/Saturday)'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{lang === 'ar' ? 'نوع الموقع *' : 'Location Type *'}</label>
              <div className="relative">
                <MapPin className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <select
                  name="location_type"
                  value={form.location_type}
                  onChange={handleChange}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:ring-green/30 focus:border-green transition-all duration-150`}
                >
                  <option value="on_site">{lang === 'ar' ? 'في الموقع' : 'On Site'}</option>
                  <option value="online">{lang === 'ar' ? 'عبر الإنترنت (أونلاين)' : 'Online'}</option>
                  <option value="phone">{lang === 'ar' ? 'هاتفي' : 'Phone'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{lang === 'ar' ? 'تفاصيل الموقع' : 'Location Details'}</label>
              <div className="relative">
                <MapPin className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-3 w-4 h-4 text-gray-400`} />
                <textarea
                  name="location_details"
                  value={form.location_details}
                  onChange={handleChange}
                  placeholder={lang === 'ar' ? 'أدخل تفاصيل الموقع' : 'Enter location details'}
                  rows={3}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:ring-green/30 focus:border-green transition-all duration-150`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isScheduling}
                className="flex-1 px-4 py-2.5 bg-green text-white font-semibold rounded-lg hover:bg-green/90 disabled:opacity-50 transition-colors"
              >
                {isScheduling 
                  ? (lang === 'ar' ? 'جاري الجدولة...' : 'Scheduling...') 
                  : (lang === 'ar' ? 'تحديد الموعد' : 'Schedule Interview')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (jobId) {
                    navigate(`/Hr/job-postings/${jobId}/interviews`);
                  } else {
                    navigate('/Hr/interviews');
                  }
                }}
                className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;