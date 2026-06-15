// src/core/modules/HR/pages/JobPostings/JobPostingsCard.tsx
import { Eye, Edit, XCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { JobPosting } from '../../../../../api/service/HrService/Types/JobPostingsService.types';

interface JobPostingsCardProps {
  posting: JobPosting;
  onClose: (id: number) => void;
  onDelete: (id: number) => void;
  isClosing: boolean;
  isDeleting: boolean;
}

export default function JobPostingsCard({ posting, onClose, onDelete, isClosing, isDeleting }: JobPostingsCardProps) {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-gray-800 break-words max-w-xs">{posting.job_title}</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">{posting.description || '—'} </td>
      <td className="px-4 py-3 text-sm text-gray-600">{posting.experience}+ years</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
          posting.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {posting.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(`/Hr/job-postings/${posting.id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="View">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => navigate(`/Hr/job-postings/edit/${posting.id}`)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded" title="Edit">
            <Edit className="w-3.5 h-3.5" />
          </button>
          {posting.status === 'open' && (
            <button onClick={() => onClose(posting.id)} disabled={isClosing} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded disabled:opacity-50" title="Close">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onDelete(posting.id)} disabled={isDeleting} className="p-1.5 text-red-500 hover:bg-red-50 rounded disabled:opacity-50" title="Delete">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}