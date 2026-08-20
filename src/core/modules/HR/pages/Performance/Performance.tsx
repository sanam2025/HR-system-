// src/core/modules/HR/pages/Performance/Performance.tsx
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { usePendingEvaluations } from '../../hooks/usePerformance';
import Loading from '../../../../../shared/components/Loading';
import type { PerformanceEvaluation } from '../../types/PerformanceService.types';
//  إضافة استيراد النوع

export default function Performance() {
  const navigate = useNavigate();
  const { evaluations, isLoading } = usePendingEvaluations();

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <h1 className="text-2xl font-bold text-gray-900 mb-4"> Pending Evaluations</h1>
      <p className="text-gray-500 text-sm mb-6">Review and approve employee performance evaluations.</p>

      {evaluations.length === 0 ? (
        <p className="text-gray-400">No pending evaluations.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluations.map((evalItem: PerformanceEvaluation) => (
            <div
              key={evalItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/Hr/performance/${evalItem.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{evalItem.employee.name}</p>
                  <p className="text-xs text-gray-500">Q{evalItem.quarter} {evalItem.year}</p>
                  <p className="text-xs text-gray-500">Manager: {evalItem.manager.name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Pending HR Review</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}