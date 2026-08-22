import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMandatoryOvertime, useVoluntaryOvertime, useApproveMandatoryOvertime, useRejectMandatoryOvertime } from '../../hooks/useOvertime';
import Loading from '../../../../../shared/components/Loading';import type { OvertimeRequest } from '../../types/overtime.types';

export default function Overtime() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'mandatory' | 'voluntary'>('mandatory');

  const { requests: mandatory, isLoading: loadingMandatory } = useMandatoryOvertime();
  const { requests: voluntary, isLoading: loadingVoluntary } = useVoluntaryOvertime();
  const approveMutation = useApproveMandatoryOvertime();
  const rejectMutation = useRejectMandatoryOvertime();

  const isLoading = loadingMandatory || loadingVoluntary;

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <button
        onClick={() => navigate('/Hr')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Overtime Requests</h1>
        <div className="flex gap-2 bg-white rounded-lg border p-1">
          <button
            onClick={() => setTab('mandatory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'mandatory' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mandatory (HR Action)
          </button>
          <button
            onClick={() => setTab('voluntary')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'voluntary' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Voluntary (View Only)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">End</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">              {(tab === 'mandatory' ? mandatory : voluntary).map((req: OvertimeRequest) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {req.user?.full_name || `User #${req.user_id}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(req.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.start_time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.end_time}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/Hr/overtime/${req.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                    {tab === 'mandatory' && req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={rejectMutation.isPending}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {(tab === 'mandatory' ? mandatory : voluntary).length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}