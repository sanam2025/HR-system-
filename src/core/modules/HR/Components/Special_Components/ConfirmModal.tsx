// src/core/modules/HR/components/ConfirmModal.tsx
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'approve' | 'reject';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isApprove = type === 'approve';
  const icon = isApprove ? <CheckCircle className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />;
  const buttonColor = isApprove ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${buttonColor} disabled:opacity-50`}
          >
            {isLoading ? 'Loading...' : isApprove ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
}