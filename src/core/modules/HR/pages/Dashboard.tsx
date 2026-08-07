// src/core/modules/HR/pages/Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, TrendingUp, DollarSign, Megaphone, 
  Building2, ChevronRight, Plus, X
} from 'lucide-react';
import StatCard from '../Components/common_Components/StatCard';
import { useActiveAnnouncements, useCreateAnnouncement } from '../hooks/useAnnouncements';
import AnnouncementCard from '../Components/Special_Components/AnnouncementCard';
import { useDepartmentsWithUsers } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import type { CreateAnnouncementData } from '../../../../api/service/HrService/Types/AnnouncementsService.types';
import { AxiosError } from 'axios';

// ✅ استيراد أنواع الأقسام والموظفين
import type { Department, Employee } from '../../../../api/service/HrService/Types/DepartmentsService.types';

const STATS_DATA = {
  totalEmployees: 0,
  pendingLeaves: 0,
  attendanceRate: "0%",
  payrollCost: "0 SYP",
} as const;

const STATS_CONFIG = [
  { key: "totalEmployees" as const, title: "Total Employees", icon: Users, color: "blue" as const, path: "/Hr/employees" },
  { key: "pendingLeaves" as const, title: "Pending Leave Requests", icon: Calendar, color: "orange" as const, path: "/Hr/leaves" },
  { key: "payrollCost" as const, title: "Payroll Cost", icon: DollarSign, color: "green" as const, path: "/Hr/payroll" },
  { key: "attendanceRate" as const, title: "Attendance Rate", icon: TrendingUp, color: "teal" as const, path: "/Hr/attendance" },
] as const;

const getStatValue = (key: keyof typeof STATS_DATA) => STATS_DATA[key];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const { 
    announcements, 
    isLoading: announcementsLoading, 
    refetch,
    error: announcementsError 
  } = useActiveAnnouncements({ status: 'active' });

  // ✅ تعريف نوع المصفوفة بشكل صريح
  const { 
    departments, 
    isLoading: departmentsLoading,
    error: departmentsError
  } = useDepartmentsWithUsers() as { 
    departments: (Department & { employees?: Employee[] })[],
    isLoading: boolean,
    error: string | null
  };

  const createAnnouncement = useCreateAnnouncement();

  // ✅ استخدام حقول الـ UI فقط، وسنقوم ببناء الـ Payload عند الإرسال
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_audience: 'all',
    priority: 'medium',
    starts_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    expires_at: '',
  });

  const handleApiError = (err: unknown) => {
    if (err instanceof AxiosError && err.response?.status === 422) {
      const data = err.response.data as Record<string, string[]>;
      const firstKey = Object.keys(data)[0];
      const firstMessage = data[firstKey]?.[0];
      if (firstMessage) {
        toast.error(`❌ ${firstMessage}`);
      } else {
        toast.error('❌ Validation error. Please check required fields.');
      }
    } else if (err instanceof Error) {
      toast.error(`❌ ${err.message}`);
    } else {
      toast.error('❌ An unexpected error occurred.');
    }
  };

  const handleNavigate = (path: string) => () => navigate(path);

  if (announcementsError) {
    console.warn('Announcements error (handled):', announcementsError);
  }
  if (departmentsError) {
    console.warn('Departments error (handled):', departmentsError);
  }

  const hasDepartments = !departmentsLoading && departments.length > 0;
  
  // ✅ تصحيح reduce: إزالة <number> لأن النوع سيتم استنتاجه تلقائياً
  const totalEmployees = departments.reduce((acc: number, dept: Department & { employees?: Employee[] }) => {
    return acc + (dept.employees?.length || 0);
  }, 0);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }
    try {
      // ✅ بناء Payload مخصص للباك إند دون تغيير الـ Types
      const payload = {
        title: formData.title,
        content: formData.content,
        target_audience: formData.target_audience,
        priority: formData.priority,
        starts_at: formData.starts_at,
        expires_at: formData.expires_at || null,
      };

      // ✅ إرسال الـ payload وتجاوز TypeScript بأمان
      await createAnnouncement.mutateAsync(payload as unknown as CreateAnnouncementData);
      
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'medium',
        starts_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
        expires_at: '',
      });
      refetch();
      toast.success('✅ Announcement created successfully!');
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleTargetAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, target_audience: e.target.value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' });
  };

  if (departmentsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to HR Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Overview of employee performance and statistics.</p>
      </div>

      {/* Announcements Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">📢 Announcements</h2>
            {!announcementsLoading && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {announcements.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Announcement
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create New Announcement</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* ✅ حقول جديدة من الـ Collection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={handlePriorityChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={formData.target_audience}
                  onChange={handleTargetAudienceChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="employees">Employees</option>
                  <option value="managers">Managers</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starts At *</label>
                <input
                  type="datetime-local"
                  value={formData.starts_at}
                  onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expires At (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createAnnouncement.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {createAnnouncement.isPending ? 'Creating...' : 'Create Announcement'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!announcementsLoading && announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          !announcementsLoading && (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-400 border border-dashed border-gray-300">
              <Megaphone className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No announcements at the moment</p>
            </div>
          )
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STATS_CONFIG.map(({ key, title, icon: Icon, color, path }) => (
          <StatCard
            key={key}
            title={title}
            value={key === 'totalEmployees' ? totalEmployees : getStatValue(key)}
            icon={<Icon className="w-5 h-5" />}
            color={color}
            onClick={handleNavigate(path)}
          />
        ))}
      </div>

      {/* Departments Section */}
      {hasDepartments && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-800">🏢 Departments</h2>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              {departments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <div
                key={department.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/Hr/department/${department.id}`)}
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{department.name}</h3>
                    {department.manager_name && (
                      <p className="text-xs text-gray-500">Manager: {department.manager_name}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{department.employees?.length || 0} employees</span>
                  </div>
                  {department.employees && department.employees.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {department.employees.slice(0, 3).map((employee: Employee) => (
                        <div
                          key={employee.id}
                          className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs"
                          title={employee.full_name}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/Hr/employee/${employee.id}`);
                          }}
                        >
                          {employee.full_name?.charAt(0) || '?'}
                        </div>
                      ))}
                      {department.employees.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-xs">
                          +{department.employees.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}