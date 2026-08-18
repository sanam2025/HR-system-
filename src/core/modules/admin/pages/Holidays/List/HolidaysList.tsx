import { Calendar } from 'lucide-react'
import type { Holidays } from '../../../types/types';
import HolidaysCard from './HolidaysCard';
import HolidaysSkeleton from './HolidaysSkeleton';

type HolidaysProps = {
    isLoading: boolean
    error: Error | null
    holidays: Holidays[] | undefined
    refetch: () => void
}


function HolidaysList({
    isLoading,
    error,
    holidays,
    refetch
}: HolidaysProps) {
  
  if (isLoading) {
    return <HolidaysSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-3 text-red-700 hover:text-red-800 underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!holidays || holidays.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">No holidays found</h3>
        <p className="text-gray-400 text-sm mt-1">Holidays will appear here once added</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">All Holidays</h3>
            <p className="text-sm text-gray-500 mt-1">
              {holidays.length} holiday{holidays.length > 1 ? 's' : ''} scheduled
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {holidays.map((holiday) => {
          return (
            <HolidaysCard key={holiday.id} holiday={holiday}/>
          );
        })}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Showing {holidays.length} holidays</span>
        </div>
      </div>
    </div>
  );
}

export default HolidaysList;