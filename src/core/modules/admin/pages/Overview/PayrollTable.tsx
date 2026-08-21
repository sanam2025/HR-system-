import { Plus } from 'lucide-react'
import type { Payrolls } from '../../types/types';
import { useGeneratePayroll } from '../../hooks/Overview/useOverviewMutations';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

type PayrollTableProps = {
    payrollHistory: Payrolls[] | undefined;
}

function PayrollTable({
    payrollHistory
}: PayrollTableProps) {
    const { lang } = useLanguage();
    const currentMonth = new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : "default", { month: "long" });
    const currentYear = new Date().getFullYear();
    const { mutate: generatePayroll, isPending } = useGeneratePayroll();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="font-semibold text-gray-800">
          {lang === 'ar' ? 'جميع سجلات الرواتب' : 'All Payroll Records'}
        </h3>
    </div>
    <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px]">
        <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
            <th className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? 'المعرف' : 'ID'}
            </th>
            <th className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? 'الشهر' : 'Month'}
            </th>
            <th className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? 'السنة' : 'Year'}
            </th>
            <th className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? 'الحالة' : 'Status'}
            </th>
            <th className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? 'إجمالي الراتب' : 'Total Salary'}
            </th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {payrollHistory?.map((payroll) => {
              const statusLabel = payroll.status === 'completed'
                ? (lang === 'ar' ? 'مكتمل' : 'completed')
                : (lang === 'ar' ? 'معلق' : 'pending');

              return (
                <tr key={payroll.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600">#{payroll.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {new Date(payroll.year, payroll.month - 1).toLocaleString(
                        lang === 'ar' ? 'ar-SA' : "default",
                        { month: "long" }
                    )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{payroll.year}</td>
                    <td className="px-4 py-3">
                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        payroll.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                        <span
                        className={`w-1.5 h-1.5 rounded-full ${lang === 'ar' ? 'ml-1.5' : 'mr-1.5'} ${
                            payroll.status === "completed"
                            ? "bg-emerald-500"
                            : "bg-yellow-500"
                        }`}
                        ></span>
                        {statusLabel}
                    </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ${(payroll.total_salary || 0).toLocaleString()}
                    </td>
                </tr>
              );
            })}
        </tbody>
        </table>
    </div>
    </div>
  )
}

export default PayrollTable