import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOvertimeDetails } from '../../hooks/useOvertime';
import Loading from '../../../../../shared/components/Loading';

export default function OvertimeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { request, isLoading } = useOvertimeDetails(Number(id));

  if (isLoading) return <Loading />;
  if (!request) return <div className="p-6 text-red-500">Request not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button onClick={() => navigate('/Hr/overtime')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold">Overtime Details</h1>
      <div className="bg-white rounded-xl p-6 mt-4">
        <p><strong>Employee:</strong> {request.user?.full_name}</p>
        <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {request.start_time} - {request.end_time}</p>
        <p><strong>Type:</strong> {request.type}</p>
        <p><strong>Status:</strong> {request.status}</p>
        {request.notes && <p><strong>Notes:</strong> {request.notes}</p>}
      </div>
    </div>
  );
}