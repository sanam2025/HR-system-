// src/core/modules/HR/pages/Complaints/ComplaintDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useComplaint, useMarkUnderReview, useRespondComplaint } from '../../hooks/useComplaints';
import toast from 'react-hot-toast';
import type { RespondComplaintData } from '../../../../../api/service/HrService/Types/ComplaintsService.types';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const complaintId = id ? Number(id) : undefined;

  const { complaint, isLoading, refetch } = useComplaint(complaintId);
  const markUnderReview = useMarkUnderReview();
  const respondComplaint = useRespondComplaint();

  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<'resolved' | 'rejected'>('resolved');

  const handleMarkUnderReview = () => {
    if (!complaintId) return;
    markUnderReview.mutate(complaintId, {
      onSuccess: () => refetch(),
    });
  };

  const handleRespond = () => {
    if (!complaintId || !responseText.trim()) {
      toast.error(t('pleaseWriteResponse') || 'Please write a response');
      return;
    }

    const data: RespondComplaintData = {
      response: responseText,
      status: responseStatus,
    };

    respondComplaint.mutate(
      { id: complaintId, data },
      {
        onSuccess: () => {
          setResponseText('');
          refetch();
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.pending}`}>{status}</span>;
  };

  if (isLoading) {
    return <div className="p-6 text-center">{t('loading') || 'Loading...'}</div>;
  }

  if (!complaint) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">{t('complaintNotFound') || 'Complaint not found'}</p>
        <button onClick={() => navigate('/Hr/complaints')} className="mt-4 text-blue-500">{t('goBack') || 'Go Back'}</button>
      </div>
    );
  }

  const isPending = complaint.status === 'pending';
  const isUnderReview = complaint.status === 'under_review';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/Hr/complaints')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToComplaints') || 'Back to Complaints'}
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{t('complaintHash') || 'Complaint #'} {complaint.id}</p>
            </div>
            {getStatusBadge(complaint.status)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">{t('complainant') || 'Complainant'}</p>
              <p className="font-medium">{complaint.complainant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('against') || 'Against'}</p>
              <p className="font-medium">{complaint.complained_against_name}</p>
              <p className="text-xs text-gray-400">{complaint.complained_against_role}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">{t('description') || 'Description'}</p>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{complaint.description}</p>
          </div>

          {/* HR Actions */}
          <div className="border-t pt-4 mt-4">
            {isPending && (
              <button
                onClick={handleMarkUnderReview}
                disabled={markUnderReview.isPending}
                className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green disabled:opacity-50"
              >
                {markUnderReview.isPending ? (t('processing') || 'Processing...') : `🔄 ${t('startReview') || 'Start Review'}`}
              </button>
            )}

            {isUnderReview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">{t('hrResponseResolution') || 'HR Response & Resolution'}</p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={t('writeYourResponseHere') || 'Write your response here...'}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-4 mt-3">
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value as 'resolved' | 'rejected')}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="resolved">{t('resolved') || 'Resolved'}</option>
                    <option value="rejected">{t('rejected') || 'Rejected'}</option>
                  </select>
                  <button
                    onClick={handleRespond}
                    disabled={respondComplaint.isPending || !responseText.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {respondComplaint.isPending ? (t('processing') || 'Processing...') : `📤 ${t('sendResponse') || 'Send Response'}`}
                  </button>
                </div>
              </div>
            )}

            {complaint.response && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">{t('hrResponse') || 'HR Response'}</p>
                <p className="text-gray-600 mt-1">{complaint.response}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(complaint.updated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}