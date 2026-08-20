// src/core/modules/HR/pages/Employees.tsx
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight } from 'lucide-react';
import { useDepartmentsWithUsers } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';
import type { Department, Employee } from '../../../../api/service/HrService/Types/DepartmentsService.types';

export default function Employees() {
  const navigate = useNavigate();
  const { departments, isLoading } = useDepartmentsWithUsers();

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
        <h1 className="text-2xl font-bold text-gray-900"> Employees & Departments</h1>
        <p className="text-gray-500 text-sm">Manage employees and browse departments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department: Department & { employees?: Employee[] }) => (
          <div
            key={department.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/Hr/department/${department.id}`)}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
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
                <span>{department.employees?.length || 0} employees</span>
              </div>
              {department.employees && department.employees.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {department.employees.slice(0, 3).map((employee: Employee) => (
                    <div
                      key={employee.id} //  تم إضافة المفتاح هنا
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
  );
}