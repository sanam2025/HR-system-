// src/core/modules/HR/pages/Complaints/Complaints.tsx
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { useComplaints } from '../../hooks/useComplaints';
import type { Complaint } from '../../../../../api/service/HrService/Types/ComplaintsService.types';

export default function Complaints() {
  const navigate = useNavigate();
  const { complaints, isLoading, refetch } = useComplaints();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.pending}`}>{status}</span>;
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900"> Complaints Management</h1>
          <p className="text-gray-500 text-sm">View and manage all complaints from employees and managers</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complainant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Against</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((complaint: Complaint, idx: number) => (
                <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{complaint.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{complaint.author?.full_name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{complaint.subject?.full_name || 'Unknown'}</td>
                  <td className="px-4 py-3">{getStatusBadge(complaint.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {complaint.status === 'pending' && (
                      <button
                        onClick={() => navigate(`/Hr/complaints/${complaint.id}`)}
                        className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No complaints found
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