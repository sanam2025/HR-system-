// src/core/modules/HR/pages/Attendance/Attendance.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Users } from 'lucide-react';
import { useTodayAttendance, useAttendanceAnalysis, useFilteredAttendance } from '../../hooks/useAttendance';
import AttendanceStats from './AttendanceStats';
import AttendanceCard from './AttendanceCard';
import AttendanceFilters from './AttendanceFilters';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const Attendance = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  //  جلب حضور اليوم
  const { records: todayRecords, isLoading: todayLoading, refetch: refetchToday } = useTodayAttendance();

  //  جلب تحليل الحضور
  const { stats, isLoading: analysisLoading, refetch: refetchAnalysis } = useAttendanceAnalysis();

  //  جلب الحضور المفلتر
  const { records: filteredRecords, isLoading: filterLoading, refetch: refetchFiltered } = useFilteredAttendance(
    fromDate,
    toDate
  );

  //  معالج الفلترة
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.error(t.hrAttendance?.requireDatesMsg || 'Please select both from and to dates');
      return;
    }
    setIsFiltered(true);
    refetchFiltered();
  };

  //  معالج التحديث
  const handleRefresh = () => {
    refetchToday();
    refetchAnalysis();
    setIsFiltered(false);
    setFromDate('');
    setToDate('');
    toast.success(t.hrAttendance?.refreshedMsg || 'Refreshed');
  };

  //  عرض البيانات
  const records = isFiltered ? filteredRecords : todayRecords;

  const isLoading = todayLoading || analysisLoading || filterLoading;

  if (isLoading && !isFiltered) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/Hr')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> 
            {t.hrAttendance?.backToDashboard || 'Back to Dashboard'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrAttendance?.title || 'Attendance'}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.hrAttendance?.subtitle || 'Manage employee attendance'}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t.hrAttendance?.refresh || 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <AttendanceStats stats={stats} />

      {/* Filters */}
      <AttendanceFilters
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onFilter={handleFilter}
        isLoading={filterLoading}
      />

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {t.hrAttendance?.recordsTitle || 'Attendance Records'} ({records.length})
          </h3>
          {isFiltered && (
            <button
              onClick={() => {
                setIsFiltered(false);
                setFromDate('');
                setToDate('');
              }}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              {t.hrAttendance?.clearFilter || 'Clear Filter'}
            </button>
          )}
        </div>

        {records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrAttendance?.columns?.employee || 'Employee'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrAttendance?.columns?.department || 'Department'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrAttendance?.columns?.checkIn || 'Check In'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrAttendance?.columns?.checkOut || 'Check Out'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.hrAttendance?.columns?.status || 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <AttendanceCard key={record.id} record={record} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t.hrAttendance?.noRecordsFound || 'No attendance records found'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;