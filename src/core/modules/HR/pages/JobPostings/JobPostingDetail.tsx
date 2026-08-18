// src/core/modules/HR/pages/JobPostings/JobPostingDetail.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, X } from 'lucide-react';
import { useJobPosting } from '../../hooks/useJobPostings';
import { apiClient } from '../../../../../api/client';
import Loading from '../../../../../shared/components/Loading';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  status: string;
  applied_at: string;
}

export default function JobPostingDetail() {
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
        toast.error('Failed to load candidates');
      } finally {
        setLoadingCandidates(false);
      }
    };
    fetchCandidates();
  }, [jobId]);

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId || !formData.scheduled_at) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      // افترضنا أن interviewer_id ثابت = 1 (لأنك حذفته من الفورم)
      await apiClient.post(`/job-postings/${jobId}/interviews`, {
        candidate_id: selectedCandidateId,
        interviewed_by: 1, // يمكنك تغييره حسب الحاجة
        scheduled_at: formData.scheduled_at,
        location_type: formData.location_type,
        location_details: formData.location_details,
      });
      toast.success('Interview scheduled successfully!');
      setShowScheduleForm(false);
      setSelectedCandidateId(null);
      const res = await apiClient.get(`/job-postings/${jobId}/candidates`);
      setCandidates(res.data?.data || []);
    } catch {
      toast.error('Failed to schedule interview');
    }
  };

  if (jobLoading) return <Loading />;
  if (!job) return <p className="text-red-500">Job not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate('/Hr/job-postings')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
      <p className="text-gray-500 text-sm mb-6">{job.description}</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Applicants ({candidates.length})</h3>
        </div>
        {loadingCandidates ? (
          <Loading />
        ) : candidates.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No applicants yet.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Applied At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
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
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedCandidateId(c.id);
                        setShowScheduleForm(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" /> Schedule
                    </button>
                    <button onClick={() => navigate(`/Hr/recruitment/applicant/${c.id}`)} className="text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ الفورم المحسن (حذفنا interviewed_by) */}
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
    </div>
  );
}