// src/core/modules/HR/pages/Resignations/ResignationDetail.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useResignationDetails, useClassifyResignation, useDownloadResignationDocument } from '../../hooks/useResignations';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export default function ResignationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const resignId = parseInt(id || '0');

  const { resignation, isLoading } = useResignationDetails(resignId);
  const classifyMutation = useClassifyResignation();
  const downloadMutation = useDownloadResignationDocument();

  const [classification, setClassification] = useState<'mutual_consent' | 'breach_by_company' | 'breach_by_employee' | ''>('');
  const [notes, setNotes] = useState('');

  const handleClassify = () => {
    if (!classification) {
      toast.error('Please select a classification.');
      return;
    }
    classifyMutation.mutate({
      id: resignId,
      data: {
        hr_classification: classification,
        hr_classification_notes: notes,
      },
    }, {
      onSuccess: () => navigate('/Hr/resignations'), // ✅ على النجاح: الانتقال للقائمة
    });
  };

  if (isLoading) return <Loading />;
  if (!resignation) return <p className="text-red-500">Resignation not found.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <button onClick={() => navigate('/Hr/resignations')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Resignation Details</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Employee</p>
            <p className="font-medium">{resignation.employee?.full_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Type</p>
            <p className="font-medium">{resignation.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Last Working Day</p>
            <p className="font-medium">{resignation.last_working_day || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <p className="font-medium">{resignation.status}</p>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-gray-500 uppercase">Reason</p>
          <p className="font-medium text-gray-700">{resignation.reason}</p>
        </div>

        {/* Documents */}
        {resignation.documents && resignation.documents.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-gray-500 uppercase mb-2">Attached Documents</p>
            <div className="flex gap-2">
              {resignation.documents.map((doc: { id: number }) => (
                <button
                  key={doc.id}
                  onClick={() => downloadMutation.mutate({ resignationId: resignId, documentId: doc.id })}
                  disabled={downloadMutation.isPending}
                  className="flex items-center gap-2 px-3 py-1 border rounded-lg text-sm hover:bg-gray-50"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HR Classification */}
      {resignation.type === 'immediate' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">HR Classification</h3>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value as typeof classification)}
            className="w-full border rounded-lg px-3 py-2 mb-2"
          >
            <option value="">Select classification</option>
            <option value="mutual_consent">Mutual Consent</option>
            <option value="breach_by_company">Breach by Company</option>
            <option value="breach_by_employee">Breach by Employee</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add classification notes..."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handleClassify}
            disabled={classifyMutation.isPending}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {classifyMutation.isPending ? 'Classifying...' : 'Classify Resignation'}
          </button>
        </div>
      )}
    </div>
  );
}