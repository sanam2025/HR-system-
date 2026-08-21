import React, { useState } from 'react';
import { UserMinus, CheckCircle, XCircle, Search, Trash2, Loader2, Calendar, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { terminationApi } from '../../../api/termination';
import { EmployeesService } from '../../../api/service/HrService/EmployeesService';
import { getManagerEmployees } from '../../../api/manager';
import CreateTerminationModal from './CreateTerminationModal';

interface TerminationTableProps {
  role: 'hr' | 'manager' | 'admin';
}

export default function TerminationTable({ role }: TerminationTableProps) {
  const { t, lang } = useLanguage();
  const tr = t.terminations;
  const queryClient = useQueryClient();

  const [mainTab, setMainTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject' | 'delete'; id: number | null }>({
    isOpen: false,
    type: 'approve',
    id: null
  });
  const [actionReason, setActionReason] = useState('');
  const [detailsId, setDetailsId] = useState<number | null>(null);

  const { data: terminationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['terminationRequest', detailsId],
    queryFn: () => terminationApi.getTermination(detailsId!),
    enabled: !!detailsId
  });

  // Fetch queries
  const { data: allRequests = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['terminationRequests'],
    queryFn: terminationApi.getTerminationRequests
  });

  const { data: myRequests = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['myTerminationRequests'],
    queryFn: terminationApi.getMyCreatedTerminations,
    enabled: role !== 'admin' // Admin usually doesn't create requests
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['terminationEmployees', role],
    queryFn: async () => {
      if (role === 'hr') {
        const res = await EmployeesService.getEmployees();
        return res.data?.data || res.data || [];
      } else {
        return getManagerEmployees();
      }
    },
    enabled: role !== 'admin'
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: terminationApi.storeTerminationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminationRequests'] });
      if (role !== 'admin') queryClient.invalidateQueries({ queryKey: ['myTerminationRequests'] });
      toast.success(tr.toasts.created);
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      const data = error.response?.data;
      if (data?.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0] as string[];
        toast.error(firstError[0]);
      } else {
        toast.error(data?.message || tr.toasts.error);
      }
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => terminationApi.approveTermination(id, { decision_reason: actionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminationRequests'] });
      toast.success(tr.toasts.approved);
      closeActionModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || tr.toasts.error)
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => terminationApi.rejectTermination(id, { decision_reason: actionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminationRequests'] });
      toast.success(tr.toasts.rejected);
      closeActionModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || tr.toasts.error)
  });

  const deleteMutation = useMutation({
    mutationFn: terminationApi.deleteTermination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminationRequests'] });
      if (role !== 'admin') queryClient.invalidateQueries({ queryKey: ['myTerminationRequests'] });
      toast.success(tr.toasts.deleted);
      closeActionModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || tr.toasts.error)
  });

  const closeActionModal = () => {
    setActionModal({ isOpen: false, type: 'approve', id: null });
    setActionReason('');
  };

  const handleActionSubmit = () => {
    if (!actionModal.id) return;
    
    if (role === 'admin') {
      toast.error(lang === 'ar' ? "هذا ليس من دورك" : "This is not your role");
      closeActionModal();
      return;
    }

    if (actionModal.type === 'approve') approveMutation.mutate(actionModal.id);
    else if (actionModal.type === 'reject') rejectMutation.mutate(actionModal.id);
    else if (actionModal.type === 'delete') deleteMutation.mutate(actionModal.id);
  };

  const handleCreateSubmit = (formData: FormData) => {
    createMutation.mutate(formData);
  };

  const toggleRow = (id: number) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const displayedRequests = mainTab === 'all' ? allRequests : myRequests;
  const filteredRequests = displayedRequests.filter((r: any) => {
    const term = searchTerm.toLowerCase();
    const name = r.user?.name || r.employee_name || '';
    return name.toLowerCase().includes(term);
  });

  const isLoading = mainTab === 'all' ? isLoadingAll : isLoadingMy;

  return (
    <div className="space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserMinus className="text-green" size={28} />
            {tr.title}
          </h1>
          <p className="text-gray-500 mt-1">{tr.subtitle}</p>
        </div>
        {role !== 'admin' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green/90 transition-all shadow-sm shadow-green/20 flex items-center gap-2"
          >
            <UserMinus size={18} />
            {tr.createRequest}
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setMainTab('all')}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              mainTab === 'all' ? 'bg-white text-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {lang === 'ar' ? 'جميع الطلبات' : 'All Requests'}
          </button>
          {role !== 'admin' && (
            <button
              onClick={() => setMainTab('my')}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all ${
                mainTab === 'my' ? 'bg-white text-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {lang === 'ar' ? 'طلباتي' : 'My Terminations'}
            </button>
          )}
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث عن موظف...' : 'Search employee...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-green" size={32} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <UserMinus size={48} className="mb-4 opacity-50" />
            <p className="text-lg">{tr.noRequests}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium text-start">{tr.columns.employee}</th>
                  <th className="px-6 py-4 font-medium text-start">{tr.columns.type}</th>
                  <th className="px-6 py-4 font-medium text-start">{tr.columns.subtype}</th>
                  <th className="px-6 py-4 font-medium text-start">{tr.columns.date}</th>
                  <th className="px-6 py-4 font-medium text-start">{tr.columns.status}</th>
                  <th className="px-6 py-4 font-medium text-center">{tr.columns.actions}</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req: any) => {
                  const displayStatus = (() => {
                    if (req.approvals && Array.isArray(req.approvals)) {
                      const roleApproval = req.approvals.find((a: any) => a.role?.toLowerCase() === role);
                      if (roleApproval) return roleApproval.status;
                    }
                    return req.status;
                  })();

                  const isExpanded = expandedRow === req.id;

                  return (
                    <React.Fragment key={req.id}>
                      <tr 
                        onClick={() => toggleRow(req.id)}
                        className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50/50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{req.user?.name || req.employee_name || 'Unknown'}</div>
                          {(req.created_by || req.creator_name) && (
                            <div className="mt-1.5 flex items-center gap-1.5" title={lang === 'ar' ? 'أنشئ بواسطة' : 'Created by'}>
                              <span 
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold"
                              >
                                {((req.created_by?.name || req.created_by || req.creator_name || '?') as string).charAt(0).toUpperCase()}
                              </span>
                              <span className="text-[11px] text-gray-500 font-medium">
                                {req.created_by?.name || req.created_by || req.creator_name}
                                {req.created_by?.role ? ` (${req.created_by.role})` : ''}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{tr.types[req.type as keyof typeof tr.types] || req.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tr.subtypes[req.subtype as keyof typeof tr.subtypes] || req.subtype || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            {req.termination_date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${displayStatus === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                              displayStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-amber-50 text-amber-700 border-amber-200'}`}
                          >
                            {displayStatus === 'approved' && <CheckCircle size={12} />}
                            {displayStatus === 'rejected' && <XCircle size={12} />}
                            {displayStatus === 'pending' && <Loader2 size={12} />}
                            {tr.status[displayStatus as keyof typeof tr.status] || displayStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setDetailsId(req.id); }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            >
                              <Eye size={18} />
                            </button>
                            {mainTab === 'all' && req.approvals?.find((a: any) => a.role?.toLowerCase() === role)?.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActionModal({ isOpen: true, type: 'approve', id: req.id }); }}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title={tr.modal.confirmApprove}
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setActionModal({ isOpen: true, type: 'reject', id: req.id }); }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title={tr.modal.confirmReject}
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            {mainTab === 'my' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setActionModal({ isOpen: true, type: 'delete', id: req.id }); }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Request"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-gray-400">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </td>
                      </tr>
                      {/* Expanded Row for Approval Progress */}
                      {isExpanded && req.approvals && req.approvals.length > 0 && (
                        <tr className="bg-gray-50/30">
                          <td colSpan={7} className="px-6 py-6 border-b border-gray-100">
                            <div className="flex flex-col gap-4">
                              <h4 className="text-sm font-semibold text-gray-700">
                                {lang === 'ar' ? 'سجل الموافقات (Approval Progress)' : 'Approval Progress'}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3">
                                {req.approvals.map((approval: any, idx: number) => (
                                  <React.Fragment key={approval.id}>
                                    <div className="flex flex-col gap-2 min-w-[200px] p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 capitalize">{approval.role}</span>
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                          approval.status === 'approved' 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                            : approval.status === 'rejected'
                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                          {approval.status}
                                        </div>
                                      </div>
                                      {approval.decision_reason && (
                                        <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                          "{approval.decision_reason}"
                                        </div>
                                      )}
                                      {approval.approved_by && (
                                        <div className="text-xs text-gray-400 mt-1">
                                          By: {typeof approval.approved_by === 'object' ? approval.approved_by.name : approval.approved_by}
                                        </div>
                                      )}
                                    </div>
                                    {idx < req.approvals.length - 1 && (
                                      <div className="text-gray-300 hidden md:block">
                                        {lang === 'ar' ? '←' : '→'}
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {role !== 'admin' && (
        <CreateTerminationModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleCreateSubmit} 
          isSubmitting={createMutation.isPending}
          employees={employees}
        />
      )}

      {/* Action Modal (Approve/Reject/Delete) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {actionModal.type === 'approve' ? tr.modal.approveTitle : 
               actionModal.type === 'reject' ? tr.modal.rejectTitle : 'Delete Termination Request'}
            </h2>
            
            {actionModal.type !== 'delete' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.modal.reasonLabel}</label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all resize-none"
                  rows={3}
                  placeholder={lang === 'ar' ? 'اكتب السبب هنا...' : 'Enter reason here...'}
                />
              </div>
            )}

            {actionModal.type === 'delete' && (
              <p className="text-gray-600 mb-6">
                {lang === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this termination request?'}
              </p>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeActionModal}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {tr.modal.cancel}
              </button>
              <button
                onClick={handleActionSubmit}
                disabled={approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending}
                className={`px-5 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 transition-colors
                  ${actionModal.type === 'approve' ? 'bg-green hover:bg-green/90' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {(approveMutation.isPending || rejectMutation.isPending || deleteMutation.isPending) && <Loader2 size={16} className="animate-spin" />}
                {actionModal.type === 'approve' ? tr.modal.confirmApprove : 
                 actionModal.type === 'reject' ? tr.modal.confirmReject : (lang === 'ar' ? 'حذف' : 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="text-blue-600" size={24} />
                {lang === 'ar' ? 'تفاصيل إنهاء الخدمة' : 'Termination Details'}
              </h2>
              <button 
                onClick={() => setDetailsId(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : terminationDetails ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{tr.columns.employee}</p>
                      <p className="font-medium text-gray-900">{terminationDetails.user?.name || terminationDetails.employee_name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{tr.columns.date}</p>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar size={16} className="text-gray-400" />
                        {terminationDetails.termination_date}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{tr.columns.type}</p>
                      <p className="font-medium text-gray-900">{(tr.types as any)[terminationDetails.type as keyof typeof tr.types] || terminationDetails.type}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{tr.columns.subtype}</p>
                      <p className="font-medium text-gray-900">{(tr.subtypes as any)[terminationDetails.subtype as keyof typeof tr.subtypes] || terminationDetails.subtype}</p>
                    </div>
                  </div>

                  {/* Reasons & Docs */}
                  {terminationDetails.legal_reason && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        {lang === 'ar' ? 'السبب' : 'Reason'}
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {terminationDetails.legal_reason}
                      </div>
                    </div>
                  )}

                  {terminationDetails.decision_reason && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        {lang === 'ar' ? 'سبب القرار' : 'Decision Reason'}
                      </h3>
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {terminationDetails.decision_reason}
                      </div>
                    </div>
                  )}

                  {terminationDetails.documents && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        {lang === 'ar' ? 'المرفقات' : 'Attachments'}
                      </h3>
                      <a 
                        href={`https://masarhr.alwaysdata.net/storage/${terminationDetails.documents}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors border border-purple-100 text-sm font-medium"
                      >
                        <Search size={16} />
                        {lang === 'ar' ? 'عرض المرفق' : 'View Document'}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {lang === 'ar' ? 'فشل تحميل التفاصيل' : 'Failed to load details'}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setDetailsId(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

