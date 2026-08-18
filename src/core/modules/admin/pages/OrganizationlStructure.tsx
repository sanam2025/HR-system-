// core/modules/Admin/pages/Organization.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FolderTree, 
  Users, 
  UserCog, 
  Plus, 
  Edit, 
  Trash2,
  Building,
  Briefcase,
  User
} from "lucide-react";

export default function Organization() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const departments = [
    { 
      id: 1,
      name: "Information Technology", 
      manager: "Ahmed Ali", 
      employees: 45,
      subDepartments: ["Development", "Security", "Support"]
    },
    { 
      id: 2,
      name: "Human Resources", 
      manager: "Sara Khan", 
      employees: 12,
      subDepartments: ["Recruitment", "Payroll", "Training"]
    },
    { 
      id: 3,
      name: "Finance", 
      manager: "Omar Hassan", 
      employees: 18,
      subDepartments: ["Accounting", "Budgeting", "Audit"]
    },
    { 
      id: 4,
      name: "Sales & Marketing", 
      manager: "Layla Mahmoud", 
      employees: 32,
      subDepartments: ["Sales", "Marketing", "PR"]
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('organizationStructure')}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {t('manageHierarchy')}
          </p>
        </div>
        <button className="bg-green text-white px-4 py-2 rounded-xl hover:bg-green-dark transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('addDepartment')}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalDepartments')}</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalEmployees')}</p>
              <p className="text-2xl font-bold text-emerald-600">248</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('departmentManagers')}</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
            </div>
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <UserCog className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{t('managerLabel')} {dept.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{dept.employees} {t('employees')}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">{t('subDepartmentsLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {dept.subDepartments.map((sub, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}