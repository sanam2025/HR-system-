import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Users, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTodayAttendance, useAttendanceAnalysis, useFilteredAttendance } from '../../hooks/useAttendance';
import AttendanceStats from './AttendanceStats';
import AttendanceCard from './AttendanceCard';
import AttendanceFilters from './AttendanceFilters';
import Loading from '../../../../../shared/components/Loading';
import toast from 'react-hot-toast';

export const Attendance = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  // جلب حضور اليوم
  const { records: todayRecords, isLoading: todayLoading, refetch: refetchToday } = useTodayAttendance();

  // جلب تحليل الحضور
  const { stats, isLoading: analysisLoading, refetch: refetchAnalysis } = useAttendanceAnalysis();

  // جلب الحضور المفلتر
  const { records: filteredRecords, isLoading: filterLoading, refetch: refetchFiltered } = useFilteredAttendance(
    fromDate,
    toDate
  );

  // معالج الفلترة
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates');
      return;
    }
    setIsFiltered(true);
    refetchFiltered();
  };

  // معالج التحديث
  const handleRefresh = () => {
    refetchToday();
    refetchAnalysis();
    setIsFiltered(false);
    setFromDate('');
    setToDate('');
    toast.success(t('refreshed') || 'Refreshed');
  };

  // عرض البيانات
  const records = isFiltered ? filteredRecords : todayRecords;
  const filtered = records.filter((record) =>
    record.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = todayLoading || analysisLoading || filterLoading;

  if (isLoading && !isFiltered) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/Hr')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2"
          >
            {i18n.dir() === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t('backToDashboard') || 'Back to Dashboard'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('attendance')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('manageEmployeeAttendance')}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {t('refresh')}
        </button>
      </div>

      {/* Stats */}
      <AttendanceStats stats={stats} />

      {/* Filters */}
      <AttendanceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
            {t('attendanceRecords')} ({filtered.length})
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
              {t('clearFilter') || 'Clear Filter'}
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((record) => (
                  <AttendanceCard key={record.id} record={record} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('noAttendanceRecords')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;