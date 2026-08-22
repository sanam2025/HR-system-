import { useState } from "react";
import { Eye, Zap, Search, LogOut, Loader2 } from "lucide-react";
import { useLanguage } from '../../../../i18n/translations/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useResignations } from "../hooks/useResignations";

type TabType = "standard" | "immediate";

export default function Resignations() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("standard");
  const [searchTerm, setSearchTerm] = useState('');
  
  const apiType = activeTab === "standard" ? "with_notice" : "immediate";
  const { resignations, isLoading, error } = useResignations(apiType);

  const handleView = (id: number) => {
    navigate(`/Hr/resignations/${id}`);
  };

  const filteredRequests = (resignations || []).filter(r => {
    const term = searchTerm.toLowerCase();
    const name = r.employee?.full_name || 'Unknown';
    return name.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LogOut className="text-green" size={28} />
            {t('resignationRequests') || 'Resignation Requests'}
          </h1>
          <p className="text-gray-500 mt-1">{t('manageResignationRequests') || 'Manage standard and immediate resignation requests.'}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'standard' ? 'bg-white text-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('standard') || 'Standard'}
          </button>
          <button
            onClick={() => setActiveTab('immediate')}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'immediate' ? 'bg-white text-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap size={16} className={activeTab === 'immediate' ? 'text-green' : 'text-yellow-500'} /> 
            {t('immediate') || 'Immediate'}
          </button>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث عن موظف...' : 'Search employee...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all`}
          />
          <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-green" size={32} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <LogOut size={48} className="mb-4 opacity-50" />
            <p className="text-lg">{t('noResignationRequestsFound') || `No ${activeTab} resignation requests found`}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium text-start">{t('employee') || 'Employee'}</th>
                  <th className="px-6 py-4 font-medium text-start">{t('department') || 'Department'}</th>
                  <th className="px-6 py-4 font-medium text-start">{t('position') || 'Position'}</th>
                  <th className="px-6 py-4 font-medium text-start">{t('lastWorkingDay') || 'Last Working Day'}</th>
                  <th className="px-6 py-4 font-medium text-start">{t('status') || 'Status'}</th>
                  <th className="px-6 py-4 font-medium text-center">{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{r.employee?.full_name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {r.user_id || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.employee?.department?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.employee?.position?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{r.last_working_day || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.status === 'approved' ? 'bg-green/10 text-green' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        r.status === 'contract_terminated' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t(r.status) || r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleView(r.id)} 
                        className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title={t('viewDetails') || 'View Details'}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}