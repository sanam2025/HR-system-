// src/core/modules/HR/pages/Resignations/Resignations.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useResignations } from '../../hooks/useResignations';
import Loading from '../../../../../shared/components/Loading';
import type { Resignation } from '../../types/ResignationsService.types';

export default function Resignations() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<'all' | 'with_notice' | 'immediate'>('all');

  const { resignations, isLoading } = useResignations(typeFilter === 'all' ? undefined : typeFilter);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">📋 Resignations</h1>

      <div className="flex items-center gap-4 mb-6">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All</option>
          <option value="with_notice">With Notice</option>
          <option value="immediate">Immediate</option>
        </select>
      </div>

      {/* ✅ الحل: استخدام optional chaining (?.) للتأكد من أن resignations ليست undefined */}
      {!resignations || resignations?.length === 0 ? (
        <p className="text-gray-400">No resignations found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Employee</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resignations?.map((req: Resignation) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{req.employee?.full_name}</td>
                  <td className="px-5 py-4">{req.type}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{req.reason}</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                      {req.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => navigate(`/Hr/resignations/${req.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}