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
import { useDepartmentsWithUsers, useDepartments } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import type { CreateAnnouncementData } from '../../../../api/service/HrService/Types/AnnouncementsService.types';
import { AxiosError } from 'axios';

//  استيراد أنواع الأقسام والموظفين
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
  const [selectedDepartment, setSelectedDepartment] = useState<(Department & { employees?: Employee[] }) | null>(null);

  const {
    announcements,
    isLoading: announcementsLoading,
    refetch,
    error: announcementsError
  } = useActiveAnnouncements({ status: 'active' });

  //  تعريف نوع المصفوفة بشكل صريح
  const {
    departments: departmentsWithUsers,
    isLoading: departmentsLoading,
    error: departmentsError
  } = useDepartmentsWithUsers() as {
    departments: (Department & { employees?: Employee[] })[],
    isLoading: boolean,
    error: string | null
  };

  const { departments: departmentsNames } = useDepartments();

  const departments = departmentsWithUsers.map(dept => {
    const actualId = (dept as any).department_id || (dept as any).department?.id || dept.id;
    const nameData = departmentsNames.find((n: any) => String(n.id) === String(actualId));
    
    let actualName = nameData?.name || 'Unknown Department';
    if (typeof (dept as any).department === 'string' && (dept as any).department.trim() !== '') {
      actualName = (dept as any).department;
    } else if ((dept as any).department?.name) {
      actualName = (dept as any).department.name;
    } else if ((dept as any).department_name) {
      actualName = (dept as any).department_name;
    } else if (dept.name) {
      actualName = dept.name;
    }
      
    return {
      ...dept,
      id: actualId,
      name: actualName,
      manager_name: (dept as any).department?.manager_name || dept.manager_name,
      manager_id: (dept as any).department?.manager_id || dept.manager_id
    };
  });

  const createAnnouncement = useCreateAnnouncement();

  //  استخدام حقول الـ UI فقط، وسنقوم ببناء الـ Payload عند الإرسال
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
        toast.error(` ${firstMessage}`);
      } else {
        toast.error(' Validation error. Please check required fields.');
      }
    } else if (err instanceof Error) {
      toast.error(` ${err.message}`);
    } else {
      toast.error(' An unexpected error occurred.');
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

  //  تصحيح reduce: إزالة <number> لأن النوع سيتم استنتاجه تلقائياً
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
      //  بناء Payload مخصص للباك إند دون تغيير الـ Types
      const payload = {
        title: formData.title,
        content: formData.content,
        target_audience: formData.target_audience,
        priority: formData.priority,
        starts_at: formData.starts_at,
        expires_at: formData.expires_at || null,
      };

      //  إرسال الـ payload وتجاوز TypeScript بأمان
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
      toast.success(' Announcement created successfully!');
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
            <h2 className="text-lg font-semibold text-gray-800"> Announcements</h2>
            {!announcementsLoading && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {announcements.length}
              </span>
            )}
          </div>
        </div>

        {!announcementsLoading && announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map((announcement, index) => (
              <AnnouncementCard key={announcement.id || `announcement-${index}`} announcement={announcement} />
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
            <h2 className="text-lg font-semibold text-gray-800"> Departments</h2>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              {departments.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department, deptIndex) => (
              <div
                key={department.id || `dept-${deptIndex}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDepartment(department)}
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {department.name || (department as any).department_name || 'Unknown Department'}
                    </h3>
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
                      {department.employees.slice(0, 3).map((employee: Employee, empIndex) => (
                        <div
                          key={employee.id || `emp-${deptIndex}-${empIndex}`}
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

      {/* Department Employees Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedDepartment.name || (selectedDepartment as any).department_name || 'Unknown Department'} - Employees
              </h3>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {(() => {
                const managerId = selectedDepartment.manager_id;
                const emps = selectedDepartment.employees || [];
                // Sort to put manager at the top
                const sortedEmps = [...emps].sort((a, b) => {
                  if (a.id === managerId) return -1;
                  if (b.id === managerId) return 1;
                  return 0;
                });

                if (sortedEmps.length === 0) {
                  return <p className="text-gray-500 text-center py-4">No employees in this department.</p>;
                }

                return (
                  <div className="space-y-3">
                    {sortedEmps.map(emp => (
                      <div key={emp.id} className={`flex items-center gap-3 p-3 rounded-lg border ${emp.id === managerId ? 'border-purple-200 bg-purple-50' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {emp.full_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{emp.full_name}</p>
                          <p className="text-xs text-gray-500">{emp.email || emp.position || 'Employee'}</p>
                        </div>
                        {emp.id === managerId && (
                          <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            Manager
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}