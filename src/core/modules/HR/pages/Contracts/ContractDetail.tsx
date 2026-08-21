// src/core/modules/HR/pages/Contracts/ContractDetail.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useContract, useDownloadContract } from '../../hooks/useContracts';
import Loading from '../../../../../shared/components/Loading';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export default function ContractDetail() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contractId = id ? parseInt(id) : 0;

  const { contract, isLoading } = useContract(contractId);
  const downloadMutation = useDownloadContract();

  const handleDownload = () => {
    if (contractId) {
      downloadMutation.mutate(contractId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen text-center">
        <p className="text-red-500">{t.hrContracts?.detail?.notFound || 'Contract not found'}</p>
        <button
          onClick={() => navigate('/Hr/contracts')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {t.hrContracts?.detail?.back || 'Back to Contracts'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/Hr/contracts')}
        className={`flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors ${lang === 'ar' ? 'flex-row-reverse w-fit' : ''}`}
      >
        <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrContracts?.detail?.back || 'Back to Contracts'}
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t.hrContracts?.detail?.title || 'Contract Details'}</h1>
        <button
          onClick={handleDownload}
          disabled={downloadMutation.isPending}
          className={`flex items-center gap-2 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          <Download className="w-4 h-4" />
          {downloadMutation.isPending ? (t.hrContracts?.detail?.downloading || 'Downloading...') : (t.hrContracts?.detail?.downloadPdf || 'Download PDF')}
        </button>
      </div>

      {/* Contract Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.contractNumber || 'Contract Number'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.contractNumber}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.employee || 'Employee'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.employeeName}</p>
            <p className="text-sm text-gray-500">{contract.employeeEmail}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.department || 'Department'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.department}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.position || 'Position'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.position}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.startDate || 'Start Date'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.startDate}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.endDate || 'End Date'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.endDate}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.salary || 'Salary'}</label>
            <p className="text-gray-900 font-medium mt-1">{contract.salary.toLocaleString()} SYP</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.status || 'Status'}</label>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                contract.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : contract.status === 'expired'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {contract.status}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.workingHours || 'Working Hours'}</label>
          <p className="text-gray-900 font-medium mt-1">{contract.workingHours}</p>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500 uppercase tracking-wider">{t.hrContracts?.detail?.benefits || 'Benefits'}</label>
          <p className="text-gray-900 font-medium mt-1">{contract.benefits}</p>
        </div>
      </div>
    </div>
  );
}