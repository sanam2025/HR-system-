import React, { useState } from 'react';
import { UserMinus, CheckCircle, XCircle, Search, Trash2, Loader2, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { terminationApi } from '../../../api/termination';
import CreateTerminationModal from './CreateTerminationModal';

export default function TerminationRequests() {
  const { t, lang } = useLanguage();
  const tr = t.terminations;
  const queryClient = useQueryClient();

  const [mainTab, setMainTab] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject' | 'delete'; id: number | null }>({
    isOpen: false,
    type: 'approve',
    id: null
  });
  const [actionReason, setActionReason] = useState('');

  // Fetch queries
  const { data: allRequests = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['terminationRequests'],
    queryFn: terminationApi.getTerminationRequests
  });

  const { data: myRequests = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['myTerminationRequests'],
    queryFn: terminationApi.getMyCreatedTerminations
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: terminationApi.storeTerminationRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminationRequests'] });
      queryClient.invalidateQueries({ queryKey: ['myTerminationRequests'] });
      toast.success(tr.toasts.created);
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || tr.toasts.error)
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
      queryClient.invalidateQueries({ queryKey: ['myTerminationRequests'] });
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
    if (actionModal.type === 'approve') approveMutation.mutate(actionModal.id);
    else if (actionModal.type === 'reject') rejectMutation.mutate(actionModal.id);
    else if (actionModal.type === 'delete') deleteMutation.mutate(actionModal.id);
  };

  const handleCreateSubmit = (formData: FormData) => {
    createMutation.mutate(formData);
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
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserMinus className="text-green" size={28} />
            {tr.title}
          </h1>
          <p className="text-gray-500 mt-1">{tr.subtitle}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green/90 transition-all shadow-sm shadow-green/20 flex items-center gap-2"
        >
          <UserMinus size={18} />
          {tr.createRequest}
        </button>
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
            All Requests
          </button>
          <button
            onClick={() => setMainTab('my')}
            className={`flex-1 md:flex-none px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              mainTab === 'my' ? 'bg-white text-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Terminations
          </button>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search employee..."
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium">{tr.columns.employee}</th>
                  <th className="px-6 py-4 font-medium">{tr.columns.type}</th>
                  <th className="px-6 py-4 font-medium">{tr.columns.subtype}</th>
                  <th className="px-6 py-4 font-medium">{tr.columns.date}</th>
                  <th className="px-6 py-4 font-medium">{tr.columns.status}</th>
                  <th className="px-6 py-4 font-medium text-center">{tr.columns.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req: any) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{req.user?.name || req.employee_name || 'Unknown'}</div>
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
                        ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 
                          req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-amber-50 text-amber-700 border-amber-200'}`}
                      >
                        {req.status === 'approved' && <CheckCircle size={12} />}
                        {req.status === 'rejected' && <XCircle size={12} />}
                        {req.status === 'pending' && <Loader2 size={12} />}
                        {tr.status[req.status as keyof typeof tr.status] || req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {mainTab === 'all' && req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setActionModal({ isOpen: true, type: 'approve', id: req.id })}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={tr.modal.confirmApprove}
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => setActionModal({ isOpen: true, type: 'reject', id: req.id })}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={tr.modal.confirmReject}
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {mainTab === 'my' && (
                          <button
                            onClick={() => setActionModal({ isOpen: true, type: 'delete', id: req.id })}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateTerminationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateSubmit} 
        isSubmitting={createMutation.isPending}
      />

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
                />
              </div>
            )}

            {actionModal.type === 'delete' && (
              <p className="text-gray-600 mb-6">Are you sure you want to delete this termination request?</p>
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
                 actionModal.type === 'reject' ? tr.modal.confirmReject : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
