// src/core/modules/HR/pages/Employees.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight, Mail } from 'lucide-react';
import { useDepartmentsWithUsers } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';

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
        <h1 className="text-2xl font-bold text-gray-900">🏢 Departments</h1>
        <p className="text-gray-500 text-sm">Browse employees by department</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
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
                department.employees.map((employee) => (
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

      {departments.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No departments found</p>
        </div>
      )}
    </div>
  );
}