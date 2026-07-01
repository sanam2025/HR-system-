// src/core/modules/HR/pages/Interviews/ScheduleInterview.tsx
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MapPin } from 'lucide-react';
import { useInterviews } from '../../hooks/useInterviews';
import toast from 'react-hot-toast';

export const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { jobId: jobIdFromParams } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const candidateIdFromUrl = searchParams.get('candidateId');
  const jobIdFromQuery = searchParams.get('jobId');
  
  const jobId = jobIdFromParams || jobIdFromQuery;
  const jobIdNumber = jobId ? Number(jobId) : undefined;
  
  const { scheduleInterview, isScheduling } = useInterviews(jobIdNumber);

  const [form, setForm] = useState({
    candidate_id: candidateIdFromUrl || '',
    scheduled_at: '',
    location_type: 'on_site',
    location_details: '',
  });

  // ✅ التحقق من يوم العطلة
  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 5 || day === 6;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.candidate_id || !form.scheduled_at) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isWeekend(form.scheduled_at)) {
      toast.error('Interviews cannot be scheduled on weekends (Friday, Saturday)');
      return;
    }
    
    scheduleInterview({
      candidate_id: Number(form.candidate_id),
      scheduled_at: form.scheduled_at,
      location_type: form.location_type,
      location_details: form.location_details || '',
    });
    
    toast.success('✅ Interview added to schedule successfully!');
    
    if (jobId) {
      navigate(`/Hr/job-postings/${jobId}/interviews`);
    } else {
      navigate('/Hr/interviews');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Interviews
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule a new interview for this job posting</p>
          {candidateIdFromUrl && (
            <p className="text-sm text-purple-600 mt-2">
              👤 Scheduling interview for Candidate #{candidateIdFromUrl}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Candidate ID *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="candidate_id"
                  value={form.candidate_id}
                  onChange={handleChange}
                  placeholder="Enter candidate ID"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly={!!candidateIdFromUrl}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date & Time *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="datetime-local"
                  name="scheduled_at"
                  value={form.scheduled_at}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Choose a weekday (Sunday - Thursday)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Type *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="location_type"
                  value={form.location_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="on_site">On Site</option>
                  <option value="online">Online</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Details</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  name="location_details"
                  value={form.location_details}
                  onChange={handleChange}
                  placeholder="Enter location details"
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isScheduling}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
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
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;