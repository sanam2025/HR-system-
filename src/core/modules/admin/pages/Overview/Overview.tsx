
import {
  Plus,
  Users,
} from "lucide-react";

import { useCurrentPayroll, usePayrolls, usePrecentages } from "../../hooks/Overview/useOverviews";
import { useGeneratePayroll } from "../../hooks/Overview/useOverviewMutations";
import { useDepartments } from "../../hooks/orginization/useOrginization";
import StatsCards from "./cards/StatsCards";
import AttendanceChart from "./charts/AttendanceChart";
import DepartmentChart from "./charts/DepartmentChart";

import DepartmentList from "./DepartmentList";
import PayrollTable from "./PayrollTable";
import CurrentPayroll from "./cards/CurrentPayroll";

import Skeleton from "./Skeleton";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

export default function Overview() {
  const { t, lang } = useLanguage();
  const { data: payrolls, isLoading: isLoadingPayrolls } = usePayrolls();
  const { data: departments, isLoading: isLoadingDepartments } = useDepartments();
  const { data: precentages, isLoading: isLoadingPrecenatge } = usePrecentages();
  const { data: currentPayroll, isLoading: isLoadingCurrentPayroll } = useCurrentPayroll();
  const { mutate: generatePayroll, isPending } = useGeneratePayroll();

  const isLoading = isLoadingPayrolls || isLoadingDepartments || isLoadingPrecenatge || isLoadingCurrentPayroll;

  if (isLoading) {
    return <Skeleton />;
  }

  const hasDepartments = departments?.data && departments.data.length > 0;
  const hasPayrolls = payrolls?.data && payrolls.data.length > 0;
  const hasPrecentages = precentages && Object.keys(precentages).length > 0;
  const hasCurrentPayroll = currentPayroll?.data && Object.keys(currentPayroll.data).length > 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lang === 'ar' ? 'نظرة عامة والتقارير' : 'Overview & Reports'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {lang === 'ar' ? 'نظرة عامة على أداء الشركة والتحليلات' : 'Company performance and analytics overview'}
          </p>
        </div>
      </div>

      {hasDepartments && hasPrecentages ? (
        <StatsCards departments={departments?.data} precentages={precentages} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <p className="text-gray-500">
            {lang === 'ar' ? 'لا توجد بيانات إحصائية متاحة' : 'No statistics data available'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {hasPrecentages ? (
          <AttendanceChart attendanceData={precentages} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-[350px]">
            <p className="text-gray-500">
              {lang === 'ar' ? 'لا توجد بيانات حضور متاحة' : 'No attendance data available'}
            </p>
          </div>
        )}

        {hasDepartments ? (
          <DepartmentChart departmentData={departments?.data} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-[350px]">
            <p className="text-gray-500">
              {lang === 'ar' ? 'لا توجد بيانات أقسام متاحة' : 'No department data available'}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {hasCurrentPayroll ? (
          <CurrentPayroll currentPayroll={currentPayroll?.data} />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-[350px]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                {lang === 'ar' ? 'لا توجد بيانات رواتب حالية' : 'No current payroll data'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {lang === 'ar' ? 'قم بتوليد مسير رواتب لرؤية الملخص' : 'Generate a payroll to see summary'}
              </p>
            </div>
          </div>
        )}
      </div>


      {hasDepartments ? (
        <DepartmentList departmentData={departments?.data} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-6">
          <p className="text-gray-500">
            {lang === 'ar' ? 'لا توجد أقسام متاحة' : 'No departments available'}
          </p>
        </div>
      )}

      {hasPayrolls ? (
        <PayrollTable payrollHistory={payrolls?.data} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">
              {lang === 'ar' ? 'لم يتم العثور على سجلات رواتب' : 'No payroll records found'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {lang === 'ar' ? 'قم بتوليد أول مسير رواتب للبدء' : 'Generate your first payroll to get started'}
            </p>
            <button 
              onClick={() => generatePayroll()}
              disabled={isPending}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isPending ? (lang === 'ar' ? 'جاري التوليد...' : 'Generating...') : (lang === 'ar' ? 'توليد الرواتب' : 'Generate Payroll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}