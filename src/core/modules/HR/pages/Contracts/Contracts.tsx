// src/core/modules/HR/pages/Contracts/Contracts.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, X } from 'lucide-react';
import { useContracts, useContractsExpiringSoon, useRenewContract, useNonRenewContract, useDownloadContract } from '../../hooks/useContracts';
import Loading from '../../../../../shared/components/Loading';
import type { EmployeeContract } from '../../types/contract.types';

export default function Contracts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'expiring'>('all');
  const [renewContractId, setRenewContractId] = useState<number | null>(null);
  const [renewData, setRenewData] = useState({ new_start_date: '', new_end_date: '', new_hour_price: 0 });

  // Hooks
  const { contracts, isLoading: loadingAll, refetch: refetchAll } = useContracts();
  const { contracts: expiringContracts, isLoading: loadingExpiring, refetch: refetchExpiring } = useContractsExpiringSoon();
  const renewMutation = useRenewContract();
  const nonRenewMutation = useNonRenewContract();
  const downloadMutation = useDownloadContract();

  const isLoading = loadingAll || loadingExpiring;

  // Handlers
  const handleView = (id: number) => {
    navigate(`/Hr/contracts/${id}`);
  };

  const handleDownload = (id: number) => {
    downloadMutation.mutate(id);
  };

  const handleRenew = (id: number) => {
    setRenewContractId(id);
    // تعيين التاريخ الافتراضي (اليوم + سنة واحدة)
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
    if (confirm('Are you sure you want to mark this contract as non-renewable?')) {
      nonRenewMutation.mutate(id, {
        onSuccess: () => {
          refetchAll();
          refetchExpiring();
        },
      });
    }
  };

  // عرض الجدول بناءً على التبويب
  const currentContracts = activeTab === 'all' ? contracts : expiringContracts;
  const currentTitle = activeTab === 'all' ? 'All Employment Contracts' : 'Contracts Expiring Soon';
  const currentDesc = activeTab === 'all' ? 'Manage all employee contracts.' : 'Contracts that are about to expire.';

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header & Tabs */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employment Contracts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage employee contracts and renewals.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Contracts
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === 'expiring' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Expiring Soon <span className="ml-1 text-xs text-red-500">({expiringContracts.length})</span>
          </button>
        </div>
      </div>

      {/* العنوان الفرعي حسب التبويب */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">{currentTitle}</h2>
        <p className="text-gray-500 text-sm">{currentDesc}</p>
      </div>

      {/* جدول العقود */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contract #</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentContracts.map((contract: EmployeeContract) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{contract.contractNumber}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{contract.employeeName}</span>
                      <span className="text-xs text-gray-500">{contract.employeeEmail}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contract.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{contract.position}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {contract.startDate} → {contract.endDate}
                  </td>
                  <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                    {/* عرض التفاصيل */}
                    <button
                      onClick={() => handleView(Number(contract.id))} // ✅ تحويل إلى Number
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* تنزيل العقد */}
                    <button
                      onClick={() => handleDownload(Number(contract.id))} // ✅ تحويل إلى Number
                      disabled={downloadMutation.isPending}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {/* زر التجديد (يظهر فقط في تبويب المنتهية) */}
                    {activeTab === 'expiring' && (
                      <>
                        <button
                          onClick={() => handleRenew(Number(contract.id))} // ✅ تحويل إلى Number
                          className="px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-xs"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleNonRenew(Number(contract.id))} // ✅ تحويل إلى Number
                          disabled={nonRenewMutation.isPending}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                        >
                          Non-Renew
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {currentContracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal تجديد العقد */}
      {renewContractId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Renew Contract</h3>
              <button
                onClick={() => setRenewContractId(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Start Date *</label>
                <input
                  type="date"
                  value={renewData.new_start_date}
                  onChange={(e) => setRenewData({ ...renewData, new_start_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New End Date *</label>
                <input
                  type="date"
                  value={renewData.new_end_date}
                  onChange={(e) => setRenewData({ ...renewData, new_end_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Hour Price ($) *</label>
                <input
                  type="number"
                  value={renewData.new_hour_price}
                  onChange={(e) => setRenewData({ ...renewData, new_hour_price: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => setRenewContractId(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRenew}
                  disabled={renewMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {renewMutation.isPending ? 'Renewing...' : 'Confirm Renewal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}