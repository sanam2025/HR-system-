// src/core/modules/HR/pages/Employees.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight, Mail, Search, UserCog } from 'lucide-react';
import { useDepartmentsWithUsers } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';
import type { Department, Employee } from '../../../../api/service/HrService/Types/DepartmentsService.types';
import { EmployeesService } from '../../../../api/service/HrService/EmployeesService';
import toast from 'react-hot-toast';

export default function Employees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ employees: 0, managers: 0, total: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const { departments, isLoading } = useDepartmentsWithUsers();

  // جلب الإحصائيات
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const countRes = await EmployeesService.getCount();
        // افترضنا أن الـ API يرجع { data: { employees: 10, managers: 2, total: 12 } }
        setStats(countRes.data?.data || { employees: 0, managers: 0, total: 0 });
      } catch {
        toast.error('Failed to load employee statistics');
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // بحث عن موظف
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const res = await EmployeesService.searchEmployees(searchTerm);
      // هنا يمكنك التعامل مع النتائج، مثلاً فتح صفحة نتائج البحث
      console.log('Search results:', res.data);
      toast.success(`Found ${res.data?.data?.length || 0} employees`);
    } catch {
      toast.error('Search failed');
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🏢 Employees Overview</h1>
        <p className="text-gray-500 text-sm">Manage and browse employees by department</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Employees</p>
              <p className="text-lg font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Active Employees</p>
              <p className="text-lg font-bold text-gray-800">{stats.employees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCog className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Managers</p>
              <p className="text-lg font-bold text-gray-800">{stats.managers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* بحث عن موظف */}
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for an employee by name..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Search className="w-4 h-4" /> Search
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department: Department & { employees?: Employee[] }) => (
          <div
            key={department.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
              onClick={() => navigate(`/Hr/department/${department.id}`)}
            >
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  {department.name}
                </h3>
                {department.manager_name && (
                  <p className="text-xs text-gray-500">Manager: {department.manager_name}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-50">
              {department.employees && department.employees.length > 0 ? (
                department.employees.map((employee: Employee) => (
                  <div
                    key={employee.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    onClick={() => navigate(`/Hr/employee/${employee.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                        {employee.full_name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
                        <p className="text-xs text-gray-500">{employee.position || 'Employee'}</p>
                      </div>
                    </div>
                    <Mail className="w-3 h-3 text-gray-400" />
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  No employees in this department
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}