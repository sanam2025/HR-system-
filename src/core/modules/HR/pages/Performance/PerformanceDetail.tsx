// src/core/modules/HR/pages/Performance/PerformanceDetail.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEvaluationDetails, useApproveEvaluation } from '../../hooks/usePerformance';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export default function PerformanceDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const evalId = parseInt(id || '0');

  const { evaluation, isLoading } = useEvaluationDetails(evalId);
  const approveMutation = useApproveEvaluation();

  const [hrNotes, setHrNotes] = useState('');

  const handleApprove = () => {
    if (!hrNotes.trim()) {
      toast.error('Please add HR notes before approving.');
      return;
    }
    approveMutation.mutate(
      { id: evalId, hr_notes: hrNotes },
      {
        onSuccess: () => navigate('/Hr/performance'),
      }
    );
  };

  if (isLoading) return <Loading />;
  if (!evaluation) return <p className="text-red-500">Evaluation not found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <button onClick={() => navigate('/Hr/performance')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Evaluation Details</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Employee</p>
            <p className="font-medium">{evaluation.employee?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Manager</p>
            <p className="font-medium">{evaluation.manager?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Quarter</p>
            <p className="font-medium">Q{evaluation.quarter} {evaluation.year}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending HR Review</span>
          </div>
        </div>

        {/* Automated Metrics */}
        {evaluation.automated_metrics && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Automated Metrics</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <p><span className="text-gray-500">Attendance:</span> {evaluation.automated_metrics.attendance_rate}%</p>
              <p><span className="text-gray-500">Late Rate:</span> {evaluation.automated_metrics.late_rate}%</p>
              <p><span className="text-gray-500">Tasks On-Time:</span> {evaluation.automated_metrics.on_time_rate}%</p>
            </div>
          </div>
        )}

        {/* Manager Evaluation */}
        <div className="border-t border-gray-100 pt-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Manager's Evaluation</h3>
          <p className="text-sm text-gray-600"><span className="font-medium">Behavioral:</span> {evaluation.behavioral_rating}</p>
          <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Notes:</span> {evaluation.manager_notes || 'No notes provided.'}</p>
          {evaluation.next_quarter_goals && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Next Quarter Goals:</p>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {evaluation.next_quarter_goals.map((goal: string, i: number) => <li key={i}>{goal}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* HR Notes Input */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">HR Review</h3>
          <textarea
            value={hrNotes}
            onChange={(e) => setHrNotes(e.target.value)}
            placeholder="Add your notes and final review here..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          onClick={handleApprove}
          disabled={approveMutation.isPending}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {approveMutation.isPending ? 'Submitting...' : 'Approve Evaluation'}
        </button>
      </div>
    </div>
  );
}