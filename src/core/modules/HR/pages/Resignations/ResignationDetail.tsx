import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, CheckCircle, XCircle, Clock, AlertCircle, FileText, User, Calendar, Briefcase } from 'lucide-react';
import { useResignationDetails, useClassifyResignation, useDownloadResignationDocument } from '../../hooks/useResignations';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function ResignationDetail() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const resignId = parseInt(id || '0');

  const { resignation, isLoading } = useResignationDetails(resignId);
  const classifyMutation = useClassifyResignation();
  const downloadMutation = useDownloadResignationDocument();

  const [classification, setClassification] = useState<'mutual_consent' | 'breach_by_company' | 'breach_by_employee' | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (resignation?.hr_classification) {
      setClassification(resignation.hr_classification as any);
    }
    if (resignation?.hr_classification_notes) {
      setNotes(resignation.hr_classification_notes);
    }
  }, [resignation]);

  const handleClassify = () => {
    if (!classification) {
      toast.error(lang === 'ar' ? 'الرجاء اختيار تصنيف' : 'Please select a classification.');
      return;
    }
    classifyMutation.mutate({
      id: resignId,
      data: {
        hr_classification: classification,
        hr_classification_notes: notes,
      },
    }, {
      onSuccess: () => navigate('/Hr/resignations'),
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-green', bg: 'bg-green/10', label: t('approved') || 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: t('rejected') || 'Rejected' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: t('pending') || 'Pending' };
      default:
        return { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: t(status) || status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!resignation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">{lang === 'ar' ? 'الاستقالة غير موجودة' : 'Resignation Not Found'}</h2>
        <p className="text-gray-500 mb-6">{lang === 'ar' ? 'لم يتم العثور على طلب الاستقالة المطلوب.' : 'The requested resignation could not be found.'}</p>
        <button
          onClick={() => navigate('/Hr/resignations')}
          className="px-6 py-2.5 bg-green text-white rounded-xl hover:bg-green/90 transition-colors"
        >
          {lang === 'ar' ? 'العودة للاستقالات' : 'Back to Resignations'}
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(resignation.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/Hr/resignations')} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('resignationDetails') || 'Resignation Details'}</h1>
            <p className="text-gray-500 text-sm mt-1">ID: {resignation.id}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
          <span className={`font-semibold ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="text-green w-5 h-5" />
              {t('employeeInformation') || 'Employee Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('employeeName') || 'Employee Name'}</p>
                <p className="font-medium text-gray-900">{resignation.employee?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('department') || 'Department'}</p>
                <p className="font-medium text-gray-900">{resignation.employee?.department?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('position') || 'Position'}</p>
                <p className="font-medium text-gray-900">{resignation.employee?.position?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Resignation Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="text-green w-5 h-5" />
              {t('resignationInfo') || 'Resignation Info'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('resignationType') || 'Type'}</p>
                <p className="font-medium text-gray-900">
                  {resignation.type === 'immediate' 
                    ? (t('immediate') || 'Immediate') 
                    : (t('standard') || 'Standard')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('lastWorkingDay') || 'Last Working Day'}</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {resignation.last_working_day || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 mb-2">{t('reason') || 'Reason'}</p>
              <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed min-h-[100px]">
                {resignation.reason || (lang === 'ar' ? 'لا يوجد سبب محدد' : 'No reason provided')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Documents */}
        <div className="space-y-6">
          {/* Documents Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="text-blue-500 w-5 h-5" />
              {t('attachedDocuments') || 'Attached Documents'}
            </h2>
            
            {!resignation.documents || resignation.documents.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl text-gray-500 text-sm">
                {lang === 'ar' ? 'لا يوجد وثائق مرفقة' : 'No documents attached'}
              </div>
            ) : (
              <div className="space-y-3">
                {resignation.documents.map((doc: any) => (
                  <button
                    key={doc.id}
                    onClick={() => downloadMutation.mutate({ resignationId: resignId, documentId: doc.id })}
                    disabled={downloadMutation.isPending}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                        {doc.file_name || `Document ${doc.id}`}
                      </span>
                    </div>
                    <Download className={`w-4 h-4 ${downloadMutation.isPending ? 'text-gray-400' : 'text-blue-600'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HR Classification (Only for Immediate) */}
          {resignation.type === 'immediate' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 border-t-4 border-t-yellow-400">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="text-yellow-500 w-5 h-5" />
                {t('hrClassification') || 'HR Classification'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">
                    {lang === 'ar' ? 'نوع التصنيف' : 'Classification Type'}
                  </label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all"
                  >
                    <option value="" disabled>{lang === 'ar' ? 'اختر التصنيف...' : 'Select classification...'}</option>
                    <option value="mutual_consent">{lang === 'ar' ? 'اتفاق متبادل (Mutual Consent)' : 'Mutual Consent'}</option>
                    <option value="breach_by_company">{lang === 'ar' ? 'إخلال من الشركة (Breach by Company)' : 'Breach by Company'}</option>
                    <option value="breach_by_employee">{lang === 'ar' ? 'إخلال من الموظف (Breach by Employee)' : 'Breach by Employee'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">
                    {lang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={lang === 'ar' ? 'أضف ملاحظاتك هنا...' : 'Add your notes here...'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all resize-none h-24"
                  />
                </div>

                <button
                  onClick={handleClassify}
                  disabled={classifyMutation.isPending || !classification}
                  className={`w-full py-3 rounded-xl font-medium text-white transition-all flex justify-center items-center gap-2 ${
                    !classification 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-yellow-500 hover:bg-yellow-600 shadow-sm'
                  }`}
                >
                  {classifyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  {lang === 'ar' ? 'حفظ التصنيف' : 'Save Classification'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}