// core/modules/Admin/pages/Settings.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('systemSettings')}</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t('configureSettings')}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {t('workingHours')} - Blue */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('workingHours')}</h3>
          <p className="text-sm text-gray-500">Check-in: 9:00 AM | Check-out: 6:00 PM</p>
          <p className="text-sm text-gray-500 mt-1">Grace Period: 15 minutes</p>
          <p className="text-xs text-blue-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* {t('noticePeriod')} - Orange */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('noticePeriod')}</h3>
          <p className="text-sm text-gray-500">Resignation Notice: 30 days</p>
          <p className="text-sm text-gray-500 mt-1">Termination Notice: 60 days</p>
          <p className="text-xs text-orange-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* {t('officialHolidays')} - Green */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('officialHolidays')}</h3>
          <p className="text-sm text-gray-500">Weekend: Friday & Saturday</p>
          <p className="text-sm text-gray-500 mt-1">National Day: Sep 23</p>
          <p className="text-xs text-emerald-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* {t('currencySettings')} - Purple */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('currencySettings')}</h3>
          <p className="text-sm text-gray-500">Base Currency: SAR</p>
          <p className="text-sm text-gray-500 mt-1">Salary Month: March 2026</p>
          <p className="text-xs text-purple-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* Email Settings - Cyan */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-cyan-50 text-cyan-600 p-3 rounded-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('emailNotifications')}</h3>
          <p className="text-sm text-gray-500">SMTP Server: smtp.company.com</p>
          <p className="text-sm text-gray-500 mt-1">Notifications: Enabled</p>
          <p className="text-xs text-cyan-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* Security Settings - Red */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('security')}</h3>
          <p className="text-sm text-gray-500">2FA: Enabled</p>
          <p className="text-sm text-gray-500 mt-1">Session Timeout: 30 min</p>
          <p className="text-xs text-red-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* {t('roleManagement')} - Indigo */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
              <UserCog className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('roleManagement')}</h3>
          <p className="text-sm text-gray-500">Admin Roles: 3</p>
          <p className="text-sm text-gray-500 mt-1">User Roles: 5</p>
          <p className="text-xs text-indigo-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* {t('backupSettings')} - Teal */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('backupSettings')}</h3>
          <p className="text-sm text-gray-500">Auto Backup: Daily</p>
          <p className="text-sm text-gray-500 mt-1">Retention: 30 days</p>
          <p className="text-xs text-teal-600 mt-3">{t('clickToEdit')}</p>
        </div>

        {/* Language - Yellow */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('language')}</h3>
          <p className="text-sm text-gray-500">Default Language: English</p>
          <p className="text-sm text-gray-500 mt-1">RTL Support: Yes</p>
          <p className="text-xs text-yellow-600 mt-3">{t('clickToEdit')}</p>
        </div>
      </div>
    </div>
  );
}