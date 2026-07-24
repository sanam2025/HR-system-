// core/modules/Admin/pages/Search.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Filter, 
  Star, 
  Mail, 
  Phone, 
  Briefcase,
  User,
  Award
} from "lucide-react";

export default function EmployeeSearch() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const employees = [
    { id: 1, name: "Ahmed Ali", position: "IT Manager", department: "IT", rating: 4.9, email: "ahmed@company.com", phone: "+966 5XXXXXXX" },
    { id: 2, name: "Sara Khan", position: "HR Director", department: "HR", rating: 4.8, email: "sara@company.com", phone: "+966 5XXXXXXX" },
    { id: 3, name: "Omar Hassan", position: "Finance Controller", department: "Finance", rating: 4.7, email: "omar@company.com", phone: "+966 5XXXXXXX" },
    { id: 4, name: "Layla Mahmoud", position: "Sales Manager", department: "Sales", rating: 4.9, email: "layla@company.com", phone: "+966 5XXXXXXX" },
    { id: 5, name: "Khaled Saeed", position: "Senior Developer", department: "IT", rating: 4.6, email: "khaled@company.com", phone: "+966 5XXXXXXX" },
  ];

  const topRated = [...employees].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('employeeSearch')}</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t('searchFilterStaff')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {t('filter')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('totalEmployees')}</p>
              <p className="text-2xl font-bold text-gray-900">248</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('departments')}</p>
              <p className="text-2xl font-bold text-emerald-600">8</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('avgRating')}</p>
              <p className="text-2xl font-bold text-yellow-600">4.6</p>
            </div>
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* {t('topRatedEmployees')} */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-800">{t('topRatedEmployees')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topRated.map((employee, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-gray-700">{employee.rating}</span>
                <span className="text-xs text-gray-400">• {employee.department}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {employee.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {t('allEmployees')} List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{t('allEmployees')}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {employees.map((employee) => (
            <div key={employee.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-gray-900">{employee.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {employee.department}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {employee.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {employee.phone}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">{employee.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}