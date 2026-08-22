import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from 'lucide-react';
import { useComplaints } from '../../hooks/useComplaints';
import type { Complaint } from '../../../../../api/service/HrService/Types/ComplaintsService.types';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export default function Complaints() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { complaints, isLoading, refetch } = useComplaints();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.pending}`}>{t.hrComplaints?.status?.[status as keyof typeof t.hrComplaints.status] || status}</span>;
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t.hrComplaints?.loading || 'Loading...'}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrComplaints?.title || 'Complaints Management'}</h1>
          <p className="text-gray-500 text-sm">{t.hrComplaints?.subtitle || 'View and manage all complaints from employees and managers'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.title || 'Title'}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.complainant || 'Complainant'}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.against || 'Against'}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.status || 'Status'}</th>
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.date || 'Date'}</th>
                <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase">{t.hrComplaints?.table?.actions || 'Actions'}</th>
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
                  <td className="px-4 py-3 text-end">
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
                    {t.hrComplaints?.noComplaints || 'No complaints found'}
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