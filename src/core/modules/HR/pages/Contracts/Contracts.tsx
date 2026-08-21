// src/core/modules/HR/pages/Contracts/Contracts.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, X, FileText } from 'lucide-react';
import { useContracts, useContractsExpiringSoon, useRenewContract, useNonRenewContract, useDownloadContract } from '../../hooks/useContracts';
import Loading from '../../../../../shared/components/Loading';
import type { Contract } from '../../../../../api/service/HrService/Types/ContractsService.types';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export default function Contracts() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'expiring'>('all');
  const [renewContractId, setRenewContractId] = useState<number | null>(null);
  const [renewData, setRenewData] = useState({ new_start_date: '', new_end_date: '', new_hour_price: 0 });

  const { contracts, isLoading: loadingAll, refetch: refetchAll } = useContracts();
  const { contracts: expiringContracts, isLoading: loadingExpiring, refetch: refetchExpiring } = useContractsExpiringSoon();
  const renewMutation = useRenewContract();
  const nonRenewMutation = useNonRenewContract();
  const downloadMutation = useDownloadContract();

  const isLoading = loadingAll || loadingExpiring;

  const handleView = (id: number) => navigate(`/Hr/contracts/${id}`);
  const handleDownload = (id: number) => downloadMutation.mutate(id);
  const handleRenew = (id: number) => {
    setRenewContractId(id);
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    setRenewData({
      new_start_date: today.toISOString().split('T')[0],
      new_end_date: nextYear.toISOString().split('T')[0],
      new_hour_price: 0,
    });
  };

  const confirmRenew = () => {
    if (!renewContractId) return;
    renewMutation.mutate({
      id: renewContractId,
      data: {
        new_start_date: renewData.new_start_date,
        new_end_date: renewData.new_end_date,
        new_hour_price: Number(renewData.new_hour_price),
      },
    }, {
      onSuccess: () => {
        setRenewContractId(null);
        refetchAll();
        refetchExpiring();
      },
    });
  };

  const handleNonRenew = (id: number) => {
    if (confirm(t.hrContracts?.actions?.confirmNonRenew || 'Are you sure you want to mark this contract as non-renewable?')) {
      nonRenewMutation.mutate(id, {
        onSuccess: () => {
          refetchAll();
          refetchExpiring();
        },
      });
    }
  };

  const currentContracts = activeTab === 'all' ? contracts : expiringContracts;
  const currentTitle = activeTab === 'all' ? (t.hrContracts?.currentAllTitle || 'All Employment Contracts') : (t.hrContracts?.currentExpiringTitle || 'Contracts Expiring Soon');
  const currentDesc = activeTab === 'all' ? (t.hrContracts?.currentAllDesc || 'Manage all employee contracts.') : (t.hrContracts?.currentExpiringDesc || 'Contracts that are about to expire.');

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrContracts?.title || 'Employment Contracts'}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.hrContracts?.subtitle || 'Manage employee contracts and renewals.'}</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>{t.hrContracts?.allContracts || 'All Contracts'}</button>
          <button onClick={() => setActiveTab('expiring')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'expiring' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>{t.hrContracts?.expiringSoon || 'Expiring Soon'} <span className="mx-1 text-xs text-red-500">({expiringContracts.length})</span></button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{currentTitle}</h2>
        <p className="text-gray-500 text-sm">{currentDesc}</p>
      </div>

      {currentContracts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">{t.hrContracts?.noContracts || 'No contracts found.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.contractNo || 'Contract #'}</th>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.employee || 'Employee'}</th>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.department || 'Department'}</th>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.position || 'Position'}</th>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-right' : 'text-left'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.period || 'Period'}</th>
                <th className={`px-5 py-3 ${lang === 'ar' ? 'text-left' : 'text-right'} text-xs font-semibold text-gray-400 uppercase`}>{t.hrContracts?.table?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentContracts.map((c: Contract) => {
                const contract = c as any;
                const empName = contract.employee?.full_name || contract.employee?.user?.full_name || contract.employee?.name || contract.employee_name || contract.user?.full_name || (t.hrContracts?.table?.na || 'N/A');
                const empEmail = contract.employee?.email || contract.employee?.user?.email || contract.user?.email || '';
                
                return (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{contract.contract_number}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{empName}</span>
                      <span className="text-xs text-gray-500">{empEmail}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contract.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contract.job_title}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contract.start_date} &rarr; {contract.end_date}</td>
                  <td className={`px-5 py-4 ${lang === 'ar' ? 'text-left' : 'text-right'} flex items-center ${lang === 'ar' ? 'justify-start' : 'justify-end'} gap-2`}>
                    <button onClick={() => handleView(contract.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleDownload(contract.id)} disabled={downloadMutation.isPending} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><Download className="w-4 h-4" /></button>
                    {activeTab === 'expiring' && (
                      <>
                        <button onClick={() => handleRenew(contract.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-md text-xs">{t.hrContracts?.actions?.renew || 'Renew'}</button>
                        <button onClick={() => handleNonRenew(contract.id)} disabled={nonRenewMutation.isPending} className="px-3 py-1 bg-red-600 text-white rounded-md text-xs">{t.hrContracts?.actions?.nonRenew || 'Non-Renew'}</button>
                      </>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {renewContractId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t.hrContracts?.renewModal?.title || 'Renew Contract'}</h3>
              <button onClick={() => setRenewContractId(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <input type="date" value={renewData.new_start_date} onChange={(e) => setRenewData({ ...renewData, new_start_date: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="date" value={renewData.new_end_date} onChange={(e) => setRenewData({ ...renewData, new_end_date: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
              <input type="number" value={renewData.new_hour_price} onChange={(e) => setRenewData({ ...renewData, new_hour_price: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2" />
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button onClick={() => setRenewContractId(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">{t.hrContracts?.renewModal?.cancel || 'Cancel'}</button>
                <button onClick={confirmRenew} disabled={renewMutation.isPending} className="px-5 py-2 bg-emerald-600 text-white rounded-lg">{t.hrContracts?.renewModal?.confirm || 'Confirm Renewal'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}