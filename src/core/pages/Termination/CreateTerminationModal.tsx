import React, { useState } from 'react';
import { X, Upload, Loader2, Calendar } from 'lucide-react';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { getManagerEmployees } from '../../../api/manager';

interface CreateTerminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
  employees?: any[];
}

export default function CreateTerminationModal({ isOpen, onClose, onSubmit, isSubmitting, employees: propEmployees }: CreateTerminationModalProps) {
  const { t, lang } = useLanguage();
  const tr = t.terminations;

  const [userId, setUserId] = useState('');
  const [type, setType] = useState('immediate');
  const [subtype, setSubtype] = useState('misconduct');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [compensationAmount, setCompensationAmount] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  // Fetch employees to select (only if propEmployees is not provided)
  const { data: fetchedEmployees = [] } = useQuery({
    queryKey: ['managerEmployees'],
    queryFn: getManagerEmployees,
    enabled: !propEmployees
  });

  const employees = propEmployees || fetchedEmployees;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !type || !date) return;
    if (type === 'immediate' && !subtype) return;
    if (type === 'immediate' && subtype === 'misconduct' && !reason) return;
    if (type === 'immediate' && (subtype === 'company_composition' || subtype === 'mutual_agreement') && !compensationAmount) return;
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('type', type);
    
    if (type === 'immediate') {
      formData.append('subtype', subtype);
      if (subtype === 'misconduct') {
        formData.append('legal_reason', reason);
      } else if (subtype === 'company_composition' || subtype === 'mutual_agreement') {
        formData.append('compensation_amount', compensationAmount);
      }
    }
    
    formData.append('termination_date', date);
    if (document) formData.append('document', document);

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{tr.form.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Employee */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.employee} <span className="text-red-500">*</span></label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
              >
                <option value="">{tr.form.selectEmployee}</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.user_id || emp.id}>
                    {emp.user_name || emp.name || emp.full_name || emp.first_name + ' ' + emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.type} <span className="text-red-500">*</span></label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
              >
                <option value="immediate">{tr.types.immediate}</option>
                <option value="standard">{tr.types.standard}</option>
              </select>
            </div>

            {/* Subtype */}
            {type === 'immediate' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.subtype} <span className="text-red-500">*</span></label>
                <select
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
                >
                  <option value="misconduct">{tr.subtypes.misconduct}</option>
                  <option value="company_composition">{tr.subtypes.company_composition}</option>
                  <option value="mutual_agreement">{tr.subtypes.mutual_agreement}</option>
                </select>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.date} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
                />
              </div>
            </div>

            {/* Document */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.documents}</label>
              <div className="relative w-full">
                <input
                  type="file"
                  id="term-doc"
                  className="hidden"
                  onChange={(e) => setDocument(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="term-doc"
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm text-gray-600 truncate">{document ? document.name : 'Choose file...'}</span>
                  <Upload size={18} className="text-gray-400" />
                </label>
              </div>
            </div>

            {/* Compensation Amount */}
            {type === 'immediate' && (subtype === 'company_composition' || subtype === 'mutual_agreement') && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.compensationAmount} <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={compensationAmount}
                  onChange={(e) => setCompensationAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Legal Reason */}
            {type === 'immediate' && subtype === 'misconduct' && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{tr.form.reason} <span className="text-red-500">*</span></label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green/20 focus:border-green outline-none transition-all resize-none"
                  placeholder={tr.form.reason}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {tr.form.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !userId || !date}
              className="px-6 py-2.5 rounded-xl font-medium text-white bg-green hover:bg-green/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {isSubmitting ? tr.form.submitting : tr.form.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
