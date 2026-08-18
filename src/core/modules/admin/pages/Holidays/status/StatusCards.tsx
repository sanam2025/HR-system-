import { Calendar, Clock, Users, XCircle } from 'lucide-react'
import type { Holidays } from '../../../types/types';
import { CardsSkeleton } from './StatusSkeleton';

const getHolidayStatus = (date: Date) => {
  const today = new Date();
  const holidayDate = new Date(date);
  
  if (holidayDate < today) return "Passed";
  if (holidayDate.toDateString() === today.toDateString()) return "Active";
  return "Upcoming";
};

function Cards({holidays , isLoading} : {holidays: Holidays[] | undefined , isLoading: boolean}) {
  const totalHolidays = holidays?.length || 0;
  const upcomingHolidays = holidays?.filter(h => getHolidayStatus(h.date) === "Upcoming").length || 0;
  const passedHolidays = holidays?.filter(h => getHolidayStatus(h.date) === "Passed").length || 0;

  if(isLoading){
    return <CardsSkeleton/>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 ">
        <div className="bg-white rounded-2xl  shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">Total Holidays</p>
                <p className="text-2xl font-bold text-gray-900">{totalHolidays}</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                <Calendar className="w-5 h-5" />
            </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-emerald-600">{upcomingHolidays}</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                <Clock className="w-5 h-5" />
            </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">Passed</p>
                <p className="text-2xl font-bold text-gray-400">{passedHolidays}</p>
            </div>
            <div className="bg-gray-50 text-gray-400 p-3 rounded-xl">
                <XCircle className="w-5 h-5" />
            </div>
            </div>
        </div>


    </div>
  )
}

export default Cards