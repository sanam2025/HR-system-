// src/core/modules/HR/pages/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, TrendingUp, DollarSign, Megaphone, 
  Building2, ChevronRight, 
} from 'lucide-react';
import StatCard from '../Components/common_Components/StatCard';
import { useActiveAnnouncements } from '../hooks/useAnnouncements';
import AnnouncementCard from '../Components/Special_Components/AnnouncementCard';
import { useDepartmentsWithUsers } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';

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
  
  const { announcements, isLoading: announcementsLoading } = useActiveAnnouncements();
  const { departments, isLoading: departmentsLoading } = useDepartmentsWithUsers();

  const handleNavigate = (path: string) => () => navigate(path);

  const hasAnnouncements = !announcementsLoading && announcements.length > 0;
  const hasDepartments = !departmentsLoading && departments.length > 0;

  // ✅ حساب إجمالي الموظفين من الأقسام
  const totalEmployees = departments.reduce((acc, dept) => acc + (dept.employees?.length || 0), 0);

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

      {/* ✅ Announcements Section */}
      {hasAnnouncements && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">📢 Announcements</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              {announcements.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.slice(0, 3).map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      )}

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

      {/* ✅ Departments Section - كاردات أقسام */}
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
                      {department.employees.slice(0, 3).map((employee) => (
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