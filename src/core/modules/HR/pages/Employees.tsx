// src/core/modules/HR/pages/Employees.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight, UserCog, Shield } from 'lucide-react';
import Loading from '../../../../shared/components/Loading';
import { DepartmentsService } from '../../../../api/service/HrService/DepartmentsService';
import { EmployeesService } from '../../../../api/service/HrService/EmployeesService';
import toast from 'react-hot-toast';

// تعريف نوع القسم القادم من الـ API
interface DepartmentWithDetails {
  id: number;
  name: string;
  employee_count?: number;
  manager_name?: string;
}

export default function Employees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<DepartmentWithDetails[]>([]);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // إحصائيات الموظفين
  const [userStats, setUserStats] = useState({ employees: 0, managers: 0, total: 0, adminsHr: 0 });

  // جلب البيانات: إحصائيات الموظفين + تفاصيل الأقسام
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. جلب عدد الأقسام
        const countRes = await DepartmentsService.getCount();
        // ✅ تحويل القيمة إلى رقم صحيح (آمن ضد NaN)
        const count = Number(countRes.data?.data?.departments_count) || 0;
        setDepartmentCount(count);

        // 2. جلب تفاصيل الأقسام (الاسم، عدد الموظفين، المدير)
        const detailsRes = await DepartmentsService.getAllDetails();
        setDepartments(detailsRes.data?.data || []);

        // 3. جلب إحصائيات الموظفين (Total, Employees, Managers, Admins/HR)
        const statsRes = await EmployeesService.getCount();
        const data = statsRes.data?.data || { employees: 0, managers: 0, total: 0 };
        const adminsHr = Math.max(0, data.total - data.employees - data.managers);
        setUserStats({ 
          employees: data.employees, 
          managers: data.managers, 
          total: data.total,
          adminsHr
        });

      } catch (error) {
        console.error(error);
        toast.error('Failed to load departments data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // بحث عن قسم
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🏢 Employees & Departments</h1>
        <p className="text-gray-500 text-sm">Manage employees and browse departments.</p>
      </div>

      {/* ✅ إحصائيات سريعة (الأقسام + الموظفين) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Departments</p>
              <p className="text-lg font-bold text-gray-800">{departmentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Employees</p>
              <p className="text-lg font-bold text-gray-800">{userStats.total}</p>
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
              <p className="text-lg font-bold text-gray-800">{userStats.managers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Admins & HR</p>
              <p className="text-lg font-bold text-gray-800">{userStats.adminsHr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ شريط البحث عن الأقسام */}
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a department..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ✅ كاردات الأقسام (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div
            key={department.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => navigate(`/Hr/department/${department.id}`)}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center group-hover:bg-gray-50 transition-colors">
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
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{department.employee_count || 0} employees</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No departments found</p>
        </div>
      )}
    </div>
  );
}