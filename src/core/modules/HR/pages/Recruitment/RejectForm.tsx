import React from 'react';
import { XCircle } from 'lucide-react';

type RejectFormProps = {
    isLoading: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function RejectForm({
    isLoading,
    onClose,
    onConfirm
}: RejectFormProps) {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
        <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
            <div className='flex items-start gap-3 mb-4'>
                <div className='bg-red-100 rounded-full p-2'>
                    <XCircle className='text-red-600 w-5 h-5' />
                </div>
                <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        Reject Requisition
                    </h3>
                    <p className='text-gray-600'>
                        Are you sure you want to reject this job requisition? This action cannot be undone.
                    </p>
                </div>
            </div>
            
            <div className='flex justify-end gap-3'>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        'Reject'
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}

export default RejectForm;