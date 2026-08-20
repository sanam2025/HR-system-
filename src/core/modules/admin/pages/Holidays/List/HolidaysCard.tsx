import { Calendar, Clock, Edit, Trash2 } from 'lucide-react'
import type { Holidays } from '../../../types/types';
import DeleteForm from '../forms/DeleteForm';
import { useState } from 'react';
import UpdateForm from '../forms/UpdateForm';
import { useLanguage } from '../../../../../../i18n/translations/LanguageContext';

const formatDate = (date: Date, lang: string) => {
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

function HolidaysCard({holiday} : {holiday: Holidays}) {
    const { t, lang } = useLanguage();
    const [isOpen , setIsOpen] = useState(false);
    const [isOpenEdit , setIsOpenEdit] = useState(false);

    const typeLabel = holiday.type === 'official'
      ? (t.adminHolidays?.official || 'Official')
      : (t.adminHolidays?.company || 'Company');

  return (
    <>
        <div 
            key={holiday.id} 
            className="px-6 py-5 bg-white border-b border-gray-100 transition-all duration-200 group"
        >
            <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                <h4 className="font-semibold text-gray-900 text-lg transition-colors">
                    {holiday.name}
                </h4>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    holiday.type === 'official' ? 'bg-blue-50 text-blue-700 border-blue-200' : "bg-purple-50 text-purple-700 border-purple-200"
                }`}>
                    {typeLabel}
                </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(holiday.date, lang)}</span>
                </div>
                {holiday.updated_at && (
                    <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{t.adminHolidays?.updated || 'Updated:'} {formatDate(holiday.updated_at, lang)}</span>
                    </div>
                )}
                </div>
            </div>

            <div className="flex items-center gap-1 ml-4">
                <button 
                    className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200"
                    title={t.adminHolidays?.edit || "Edit holiday"}
                    onClick={() => setIsOpenEdit(true)}
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button 
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title={t.adminHolidays?.delete || "Delete holiday"}
                    onClick={() => setIsOpen(true)}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            </div>
        </div>

        <DeleteForm isOpen={isOpen} setIsModalOpen={setIsOpen} holiday={holiday}/>
        <UpdateForm isOpen={isOpenEdit} setIsModalOpen={setIsOpenEdit} holidayData={holiday}/>
    </>
  )
}

export default HolidaysCard