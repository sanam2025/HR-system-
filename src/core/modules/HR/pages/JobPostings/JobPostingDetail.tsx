// src/core/modules/HR/pages/JobPostingDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { JobPostingsService } from '../../../../../api/service/HrService/JobPostingsService';
import Loading from '../../../../../shared/components/Loading';

// تعريف نوع الخطأ
interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const getErrorMessage = (err: unknown): string => {
  const apiError = err as ApiError;
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }
  if (apiError.message) {
    return apiError.message;
  }
  return 'An error occurred';
};

export default function JobPostingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['job-posting', id],
    queryFn: () => JobPostingsService.getById(Number(id)),
    enabled: !!id,
  });

  const posting = response?.data?.data;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    setIsDeleting(true);
    try {
      await JobPostingsService.delete(Number(id));
      toast.success('Job posting deleted successfully');
      navigate('/Hr/job-postings');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error loading job posting</p>
          <button onClick={() => navigate('/Hr/job-postings')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Back to Job Postings
          </button>
        </div>
      </div>
    );
  }

  if (!posting) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-500">Job posting not found</p>
          <button onClick={() => navigate('/Hr/job-postings')} className="mt-4 text-blue-500">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-6">
        <button onClick={() => navigate('/Hr/job-postings')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{posting.job_title}</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/Hr/job-postings/edit/${posting.id}`)} 
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Job Title</p>
              <p className="font-medium text-gray-900">{posting.job_title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Experience Required</p>
              <p className="font-medium text-gray-900">{posting.experience}+ years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                posting.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {posting.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created At</p>
              <p className="font-medium text-gray-900">{new Date(posting.created_at).toLocaleDateString()}</p>
            </div>
            {posting.description && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{posting.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}