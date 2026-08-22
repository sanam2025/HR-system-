import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../../i18n/translations/LanguageContext";
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Bell, 
  Shield, 
  Globe,
  Mail,
  Lock,
  UserCog,
  Database
} from "lucide-react";

export default function Settings() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t.adminSettings?.systemSettings || 'System Settings'}</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t.adminSettings?.configureSettings || 'Configure and manage system settings'}
        </p>
      </div>      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.workingHours || 'Working Hours'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.checkInOut || 'Check-in: 9:00 AM | Check-out: 6:00 PM'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.gracePeriod || 'Grace Period: 15 minutes'}</p>
          <p className="text-xs text-blue-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.noticePeriod || 'Notice Period'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.resignationNotice || 'Resignation Notice: 30 days'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.terminationNotice || 'Termination Notice: 60 days'}</p>
          <p className="text-xs text-orange-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.officialHolidays || 'Official Holidays'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.weekend || 'Weekend: Friday & Saturday'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.nationalDay || 'National Day: Sep 23'}</p>
          <p className="text-xs text-emerald-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.currencySettings || 'Currency Settings'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.baseCurrency || 'Base Currency: SAR'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.salaryMonth || 'Salary Month: March 2026'}</p>
          <p className="text-xs text-purple-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-cyan-50 text-cyan-600 p-3 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.emailNotifications || 'Email Notifications'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.smtpServer || 'SMTP Server: smtp.company.com'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.notificationsEnabled || 'Notifications: Enabled'}</p>
          <p className="text-xs text-cyan-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.security || 'Security'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.twoFA || '2FA: Enabled'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.sessionTimeout || 'Session Timeout: 30 min'}</p>
          <p className="text-xs text-red-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
              <UserCog className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.roleManagement || 'Role Management'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.adminRoles || 'Admin Roles: 3'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.userRoles || 'User Roles: 5'}</p>
          <p className="text-xs text-indigo-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.backupSettings || 'Backup Settings'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.autoBackup || 'Auto Backup: Daily'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.retention || 'Retention: 30 days'}</p>
          <p className="text-xs text-teal-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.adminSettings?.language || 'Language'}</h3>
          <p className="text-sm text-gray-500">{t.adminSettings?.defaultLanguage || 'Default Language: English'}</p>
          <p className="text-sm text-gray-500 mt-1">{t.adminSettings?.rtlSupport || 'RTL Support: Yes'}</p>
          <p className="text-xs text-yellow-600 mt-3">{t.adminSettings?.clickToEdit || 'Click to edit'}</p>
        </div>
      </div>
    </div>
  );
}