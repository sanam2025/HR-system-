// src/core/modules/HR/pages/DepartmentDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail } from 'lucide-react';
import { useDepartmentEmployees } from '../hooks/useDepartments';
import Loading from '../../../../shared/components/Loading';

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const departmentId = id ? Number(id) : undefined;

  const { employees, isLoading } = useDepartmentEmployees(departmentId);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate('/Hr')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Department Employees</h2>
          <span className="text-sm text-gray-500">{employees.length} employees</span>
        </div>

        {employees.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                onClick={() => navigate(`/Hr/employee/${employee.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {employee.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee.full_name}</p>
                    <p className="text-sm text-gray-500">{employee.position || 'Employee'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {employee.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No employees in this department</p>
          </div>
        )}
      </div>
    </div>
  );
}