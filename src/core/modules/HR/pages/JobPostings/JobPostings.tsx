// src/core/modules/HR/pages/JobPostings/JobPostings.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobPostingsStats from './JobPostingsStats';
import JobPostingsFilters from './JobPostingsFilters';
import JobPostingsCard from './JobPostingsCard';
import Loading from '../../../../../shared/components/Loading';
import { 
  useJobPostings, 
  useCloseJobPosting, 
  useDeleteJobPosting 
} from '../../hooks/useJobPostings';

export default function JobPostings() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { postings, isLoading, error, refetch } = useJobPostings();
  const closeMutation = useCloseJobPosting();
  const deleteMutation = useDeleteJobPosting();

  const handleClose = (id: number) => {
    closeMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const filteredPostings = postings.filter(p =>
    p.job_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loading />
          <p className="text-gray-500">Loading job postings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Postings (HR)</h1>
            <p className="text-gray-500 text-sm mt-1">Manage all job postings.</p>
          </div>
        </div>
      </div>

      <JobPostingsStats postings={postings} />
      <JobPostingsFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} refetch={refetch} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPostings.map((posting) => (
                <JobPostingsCard
                  key={posting.id}
                  posting={posting}
                  onClose={handleClose}
                  onDelete={handleDelete}
                  isClosing={closeMutation.isPending}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
        {filteredPostings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No job postings found</p>
          </div>
        )}
      </div>
    </div>
  );
}