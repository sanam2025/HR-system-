// src/core/modules/HR/pages/Complaints/ComplaintDetail.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useComplaint, useRespondComplaint } from '../../hooks/useComplaints';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export default function ComplaintDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const complaintId = parseInt(id || '0');

  const { complaint, isLoading, refetch } = useComplaint(complaintId);
  const respondMutation = useRespondComplaint(); // ✅ تم تغيير الاستيراد

  const [responseText, setResponseText] = useState('');
  const [status, setStatus] = useState<'resolved' | 'rejected' | 'under_review'>('resolved');

  const handleRespond = () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }
    respondMutation.mutate({
      id: complaintId,
      data: {
        response: responseText,
        status: status,
      },
    }, {
      onSuccess: () => {
        toast.success('Response sent successfully!');
        refetch();
        setResponseText('');
      },
    });
  };

  if (isLoading) return <Loading />;
  if (!complaint) return <p className="text-red-500">Complaint not found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate('/Hr/complaints')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
        <ArrowLeft className="w-4 h-4" /> Back to Complaints
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {complaint.status}
          </span>
        </div>

        <div className="mb-6 text-sm text-gray-600">
          <p><span className="font-medium">Complainant:</span> {complaint.complainant?.full_name || 'Unknown'}</p>
          <p><span className="font-medium">Against:</span> {complaint.against?.full_name || 'Unknown'}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{complaint.description}</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">HR Response</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response here..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 mb-4"
            rows={4}
          />
          <div className="flex gap-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
            </select>
            <button
              onClick={handleRespond}
              disabled={respondMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
              {respondMutation.isPending ? 'Sending...' : 'Send Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}