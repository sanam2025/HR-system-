import { AlertCircle, Clock, Megaphone } from 'lucide-react'
import type { Announcements } from '../../../types/types'
import { CardsSkeleton } from './StatusSkeleton';
import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";

const getAnnouncemetExipre = (date: Date) =>{
  const today = new Date();
  const holidayDate = new Date(date);

  if (holidayDate < today) return "Passed";
  if (holidayDate.toDateString() === today.toDateString()) return "Active";
}

function StatusCards({announcements , isLoading} : {announcements: Announcements[] | undefined , isLoading: boolean}) {
  const { t } = useLanguage();
  const Total = announcements?.length || 0;
  const Active = announcements?.filter((a) => a.status === 'active').length || 0;
  const HighPriority = announcements?.filter((a) => a.priority === 'high').length || 0;
  const passedHolidays = announcements?.filter(a => getAnnouncemetExipre(a.expires_at) === "Passed").length || 0;

  if(isLoading){
    return <CardsSkeleton/>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.adminAnnouncements?.stats?.total || 'Total'}</p>
              <p className="text-2xl font-bold text-gray-900">{Total}</p>
            </div>
            <div className="bg-[#4A7C59]/10 text-[#4A7C59] p-3 rounded-xl">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.adminAnnouncements?.stats?.active || 'Active'}</p>
              <p className="text-2xl font-bold text-emerald-600">{Active}</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.adminAnnouncements?.stats?.highPriority || 'High Priority'}</p>
              <p className="text-2xl font-bold text-red-600">{HighPriority}</p>
            </div>
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t.adminAnnouncements?.stats?.expired || 'Expired'}</p>
              <p className="text-2xl font-bold text-gray-400">{passedHolidays}</p>
            </div>
            <div className="bg-gray-50 text-gray-400 p-3 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
    </div>
  )
}

export default StatusCards