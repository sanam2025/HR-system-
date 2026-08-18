// src/core/modules/HR/pages/Terminations.tsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiClient } from '../../../../api/client';
import toast from 'react-hot-toast';
import Loading from '../../../../shared/components/Loading';

// ✅ تعريف نوع البيانات بناءً على الريسبونس المتوقعة
interface TerminationRequest {
  id: number;
  employee_name: string;
  employee_id?: string;
  department: string;
  position?: string;
  type: 'termination' | 'contractEnd' | 'resignation';
  effective_date: string;
  reason?: string;
  status: 'pending' | 'processed' | 'draft' | 'submitted';
  submitted_date?: string;
}

export default function Terminations() {
  const [requests, setRequests] = useState<TerminationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب طلبات إنهاء الخدمة من الـ API
  useEffect(() => {
    const fetchTerminations = async () => {
      try {
        const res = await apiClient.get('/terminations'); // أو /resignations
        setRequests(res.data?.data || []);
      } catch {
        toast.error('Failed to load termination requests');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTerminations();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Employee Termination</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage employee termination, contract end, and compensation.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {requests.filter((r: TerminationRequest) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Processed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {requests.filter((r: TerminationRequest) => r.status === 'processed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Draft</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {requests.filter((r: TerminationRequest) => r.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Effective Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((r: TerminationRequest) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{r.employee_name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.type}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.effective_date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      r.status === 'processed' ? 'bg-green-100 text-green-700' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm">Process</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}