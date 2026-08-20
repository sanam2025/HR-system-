// src/core/modules/HR/pages/DepartmentDetail/DepartmentDetail.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Building2, Phone } from 'lucide-react';
import Loading from '../../../../shared/components/Loading';
import { useDepartmentEmployees } from '../hooks/useDepartments';
import type { Employee } from '../../../../api/service/HrService/Types/DepartmentsService.types';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

export default function DepartmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const departmentId = parseInt(id || '0');

  const { department, isLoading, error, refetch } = useDepartmentEmployees(departmentId);
  const { t, lang } = useLanguage();

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate('/Hr/employees')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrDepartmentDetail?.backToEmployees || 'Back to Employees'}
        </button>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-red-500">{t.hrDepartmentDetail?.errorLoading || 'Error loading department'}</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            {t.hrDepartmentDetail?.retry || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <button
        onClick={() => navigate('/Hr/employees')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
      >
        <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrDepartmentDetail?.backToEmployees || 'Back to Employees'}
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {department.employees?.length || 0} {t.hrDepartmentDetail?.employeesInDept || 'employees in this department'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t.hrDepartmentDetail?.deptInfo || 'Department Information'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase">{t.hrDepartmentDetail?.deptName || 'Department Name'}</label>
            <p className="text-gray-800 font-medium">{department.name}</p>
          </div>
          {department.manager_name && (
            <div>
              <label className="text-xs text-gray-500 uppercase">{t.hrDepartmentDetail?.manager || 'Manager'}</label>
              <p className="text-gray-800 font-medium">{department.manager_name}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">{t.hrDepartmentDetail?.employees || 'Employees'}</h3>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {department.employees?.length || 0}
          </span>
        </div>

        {department.employees && department.employees.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {department.employees.map((employee: Employee) => (
              <div
                key={employee.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/Hr/employee/${employee.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {employee.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{employee.full_name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-col items-end">
                    {employee.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t.hrDepartmentDetail?.noEmployees || 'No employees found in this department'}</p>
          </div>
        )}
      </div>
    </div>
  );
}