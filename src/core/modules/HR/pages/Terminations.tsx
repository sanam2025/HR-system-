// src/core/modules/HR/pages/Terminations/Terminations.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Eye, Check, X } from 'lucide-react';
import { apiClient } from '../../../../api/client';
import toast from 'react-hot-toast';
import Loading from '../../../../shared/components/Loading';

// تعريف الأنواع
interface TerminationRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  type: 'standard' | 'immediate';
  subtype?: 'misconduct' | 'company_composition' | 'mutual_agreement' | null;
  reason: string;
  effective_date: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  created_by: number;
  created_at: string;
  decision_reason?: string;
}

interface Employee {
  id: number;
  full_name: string;
}

export default function Terminations() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<TerminationRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // --- 1. جلب الموظفين وطلبات إنهاء الخدمة ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // جلب الموظفين (للقائمة المنسدلة)
      const empRes = await apiClient.get('/users/employees');
      setEmployees(empRes.data?.data || []);

      // جلب طلبات إنهاء الخدمة
      const res = await apiClient.get('/resignations'); // تم تغيير المسار من /terminations إلى /resignations
      setRequests(res.data?.data || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. إضافة طلب جديد ---
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get('type') as string;
    const subtype = formData.get('subtype') as string;
    const employeeId = Number(formData.get('employee_id'));
    const documents = formData.get('documents') as File;

    try {
      interface CreateResignationPayload {
        employee_id: number;
        type: string;
        reason: string | null;
        effective_date: string | null;
        subtype?: string;
        documents?: File;
      }

      const payload: CreateResignationPayload = {
        employee_id: employeeId,
        type,
        reason: (formData.get('reason') as string) || null,
        effective_date: (formData.get('effective_date') as string) || null,
      };
      if (type === 'immediate' && subtype) payload.subtype = subtype;
      if (documents) payload.documents = documents;

      await apiClient.post('/resignations', payload); // تم تغيير المسار
      toast.success('Termination request created successfully!');
      document.getElementById('createModal')?.classList.add('hidden');
      fetchData();
    } catch {
      toast.error('Failed to create termination request');
    }
  };

  // --- 3. حذف طلب ---
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await apiClient.delete(`/resignations/${id}`); // تم تغيير المسار
      toast.success('Request deleted successfully!');
      fetchData();
    } catch {
      toast.error('Failed to delete request');
    }
  };

  // --- 4. الموافقة على الطلب ---
  const handleApprove = async (id: number, decision_reason?: string) => {
    try {
      await apiClient.post(`/resignations/${id}/approve`, { decision_reason }); // تم تغيير المسار
      toast.success('Request approved successfully!');
      fetchData();
    } catch {
      toast.error('Failed to approve request');
    }
  };

  // --- 5. رفض الطلب ---
  const handleReject = async (id: number, decision_reason?: string) => {
    try {
      await apiClient.post(`/resignations/${id}/reject`, { decision_reason }); // تم تغيير المسار
      toast.success('Request rejected successfully!');
      fetchData();
    } catch {
      toast.error('Failed to reject request');
    }
  };

  // تصفية الطلبات حسب التبويب
  const filteredRequests = activeTab === 'all' ? requests : requests.filter(r => r.created_by === 1); // نفترض أن الـ ID الخاص بـ HR هو 1

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* الهيدر والتبويبات */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Employee Termination</h1>
          <p className="text-gray-500 text-sm mt-1">Manage employee termination requests.</p>
        </div>
        <button
          onClick={() => document.getElementById('createModal')?.classList.remove('hidden')}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* التبويبات */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Requests
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Requests
        </button>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Subtype</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Effective Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium">{r.employee_name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.type}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.subtype || '-'}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{r.effective_date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right flex gap-2">
                    {/* عرض التفاصيل */}
                    <button
                      onClick={() => navigate(`/Hr/terminations/${r.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* حذف */}
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* موافقة */}
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    {/* رفض */}
                    <button
                      onClick={() => handleReject(r.id)}
                      className="text-orange-600 hover:text-orange-800 text-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ نموذج إنشاء طلب جديد (مع قائمة الموظفين) */}
      <div id="createModal" className="fixed inset-0 bg-black/50 backdrop-blur-sm items-center justify-center z-50 hidden">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Create Termination Request</h3>
            <button onClick={() => document.getElementById('createModal')?.classList.add('hidden')} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-4">
            {/* ✅ قائمة منسدلة لاختيار الموظف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
              <select name="employee_id" className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select name="type" className="w-full border rounded-lg px-3 py-2" required>
                <option value="standard">Standard</option>
                <option value="immediate">Immediate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtype (Immediate only)</label>
              <select name="subtype" className="w-full border rounded-lg px-3 py-2">
                <option value="">None</option>
                <option value="misconduct">Misconduct</option>
                <option value="company_composition">Company Composition</option>
                <option value="mutual_agreement">Mutual Agreement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
              <input type="text" name="reason" className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
              <input type="date" name="effective_date" className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
              <input type="file" name="documents" className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button onClick={() => document.getElementById('createModal')?.classList.add('hidden')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Create
              </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
}