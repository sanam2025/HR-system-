import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Plus,
  List,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCreateDeduction, useDeductions } from "../hooks/useDeductions";
import { useCreateIncentive, useIncentives } from "../hooks/useIncentives";
import { PayrollsService } from "../../../../api/service/HrService/PayrollsService";
import { apiClient } from "../../../../api/client";
import type { PayrollRecord } from "../types/payroll.types";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/authStore";
import { useLanguage } from "../../../../i18n/translations/LanguageContext";

const formatSalary = (amount: number, locale = 'en-US') => {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SY' : "en-US", {
    style: "currency",
    currency: "SYP",
    maximumFractionDigits: 0,
  }).format(amount);
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const EmptyState = ({ isAr }: { isAr: boolean }) => (
  <div className="text-center py-12">
    <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
    <p className="text-sm text-gray-400">
      {isAr ? "لم يتم العثور على سجلات رواتب" : "No payroll records found"}
    </p>
  </div>
);

export default function Payroll() {  const { lang, isRTL } = useLanguage();
  const { incentives } = useIncentives();
  const { deductions } = useDeductions();
  const createIncentive = useCreateIncentive();
  const createDeduction = useCreateDeduction();
  const { currentUser } = useAuthStore();  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [employees, setEmployees] = useState<{ id: number; full_name?: string; name?: string }[]>([]);

  const [showIncentiveModal, setShowIncentiveModal] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [serverSummary, setServerSummary] = useState<any>(null);

  const [newIncentive, setNewIncentive] = useState({
    user_id: 0,
    amount: 0,
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [newDeduction, setNewDeduction] = useState({
    user_id: 0,
    amount: 0,
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await apiClient.get("/users/employees");
        if (empRes.data?.data) setEmployees(empRes.data.data);

        try {
          const userRole = currentUser?.role?.toLowerCase() || '';
          const isHr = userRole.includes('hr');

          let payslips: any[] = [];
          if (isHr) {
            try {
              const [payslipsRes, summaryRes] = await Promise.all([
                PayrollsService.getCurrentMonthPayslips(),
                PayrollsService.getPayslipsSummary().catch(() => null)
              ]);
              const pData = payslipsRes.data?.data || payslipsRes.data;
              payslips = Array.isArray(pData) ? pData : Array.isArray(pData?.payslips) ? pData.payslips : [];

              if (summaryRes) {
                const sData = summaryRes.data?.data || summaryRes.data;
                setServerSummary(sData?.summary || sData);
              }
            } catch (err) {
              console.error("Error fetching HR payslips", err);
            }
          } else {
            try {
              const payrollRes = await PayrollsService.getCurrentPayroll();
              const pData = payrollRes.data?.data || payrollRes.data;
              payslips = Array.isArray(pData) ? pData : Array.isArray(pData?.payslips) ? pData.payslips : [];
              setServerSummary(pData?.summary || pData);
            } catch (err) {
              console.error("Error fetching payroll", err);
            }
          }

          if (payslips.length > 0) {
            const mapped = Array.isArray(payslips) ? payslips.map((p: any) => {
              const details = p.salary_details || {};
              const emp = p.employee || {};
              
              let base = Number(details.base_salary || details.basic_salary || details.salary || p.base_salary || p.gross_salary || p.baseSalary || p.basic_salary || p.salary || emp.salary || 0);
              let net = Number(details.net_salary || details.net || details.total_salary || p.net_salary || p.netSalary || p.net_total || p.net_amount || p.net || 0);              let b = Number(details.incentive_amount || 0) + Number(details.overtime_amount || 0) + 
                      Number(details.incentive || details.allowance || details.allowances || details.total_allowances || details.rewards || details.incentives || details.bonuses || details.total_incentives || p.incentives_total || p.incentives || p.bonuses || emp.incentives || 0);
              
              let d = Number(details.deductions_amount || 0) + 
                      Number(details.deduction || details.penalties || details.total_deduction || details.deductions || details.total_deductions || p.deductions_total || p.deductions || emp.deductions || 0);

              return {
                id: p.id,
                employeeName: (p.user_name || p.user?.name || p.user?.full_name || p.employee?.name || p.employee?.full_name || p.employee_name || p.name || emp.name || emp.full_name || (lang === 'ar' ? 'غير معروف' : 'Unknown')),
                department: p.department_name || p.user?.department || p.employee?.department || emp.department || p.department || (lang === 'ar' ? 'عام' : 'General'),
                baseSalary: base,
                bonuses: b,
                deductions: d,
                netSalary: net,
                month: p.month || String(new Date().getMonth()),
                year: p.year || new Date().getFullYear(),
                status: p.status || 'generated',
              };
            }) : [];
            setRecords(mapped);
          }
        } catch (error: any) {
          if (error?.response?.status !== 403) {
            toast.error(lang === 'ar' ? "تعذر تحميل بيانات الرواتب" : "Failed to load payroll data");
          }
        }
      } catch (error: any) {
      }
    };
    fetchData();
  }, [currentUser, lang]);  const handleCreateIncentive = () => {
    if (!newIncentive.user_id) {
      toast.error(lang === 'ar' ? "يرجى اختيار الموظف" : "Please select an employee");
      return;
    }
    createIncentive.mutate(newIncentive, {
      onSuccess: () => {
        setShowIncentiveModal(false);
        setNewIncentive({ user_id: 0, amount: 0, reason: "", date: new Date().toISOString().split("T")[0] });
      },
    });
  };

  const handleCreateDeduction = () => {
    if (!newDeduction.user_id) {
      toast.error(lang === 'ar' ? "يرجى اختيار الموظف" : "Please select an employee");
      return;
    }
    createDeduction.mutate(newDeduction, {
      onSuccess: () => {
        setShowDeductionModal(false);
        setNewDeduction({ user_id: 0, amount: 0, reason: "", date: new Date().toISOString().split("T")[0] });
      },
    });
  };  const totalBaseSalary = serverSummary?.base_salary || serverSummary?.total_salary || records.reduce((acc, r) => acc + (Number(r.baseSalary) || 0), 0);
  const totalIncentives = serverSummary?.incentives || serverSummary?.total_incentives || incentives.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalDeductions = serverSummary?.deductions || serverSummary?.total_deductions || deductions.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalNetSalary = serverSummary?.net_salary || serverSummary?.total_net_salary || records.reduce((acc, r) => acc + (Number(r.netSalary) || 0), 0);  const historyItems = useMemo(() => {
    const combined = [
      ...incentives.map(item => ({ ...item, type: 'incentive' as const })),
      ...deductions.map(item => ({ ...item, type: 'deduction' as const }))
    ];
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incentives, deductions]);

  const itemsPerPage = 5;
  const totalHistoryPages = Math.max(1, Math.ceil(historyItems.length / itemsPerPage));
  const currentHistoryItems = historyItems.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {lang === 'ar' ? 'إدارة الرواتب' : 'Payroll Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {lang === 'ar' ? 'عرض وإدارة الرواتب الشهرية والمكافآت والخصومات' : 'View and manage monthly salaries, incentives, and deductions'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowIncentiveModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3a6347] transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4" /> {lang === 'ar' ? 'إضافة مكافأة' : 'Create Incentive'}
            </button>
            <button
              onClick={() => setShowDeductionModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#6B6358] text-white rounded-lg hover:bg-[#5a5348] transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial"
            >
              <Plus className="w-4 h-4" /> {lang === 'ar' ? 'إضافة خصم' : 'Create Deduction'}
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#C4A66A] text-white rounded-lg hover:bg-[#b09355] transition-colors text-xs sm:text-sm font-medium flex-1 sm:flex-initial">
              <List className="w-4 h-4" /> {lang === 'ar' ? 'السجل' : 'History'}
            </button>
            <div className="flex items-center justify-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-initial">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">
                {(() => {
                  const d = new Date();
                  d.setMonth(d.getMonth() - 1);
                  return d.toLocaleString(lang === 'ar' ? 'ar-SA' : 'default', { month: 'long', year: 'numeric' });
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4A4E4A]/10 rounded-lg">
              <Users className="w-4 h-4 text-[#4A4E4A]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</p>
              <p className="text-lg font-bold text-gray-800">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4A7C59]/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-[#4A7C59]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{lang === 'ar' ? 'إجمالي المكافآت' : 'Total Incentives'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalIncentives, lang)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6B6358]/10 rounded-lg">
              <TrendingDown className="w-4 h-4 text-[#6B6358]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{lang === 'ar' ? 'إجمالي الخصومات' : 'Total Deductions'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalDeductions, lang)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C4A66A]/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-[#C4A66A]" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{lang === 'ar' ? 'الراتب الأساسي' : 'Base Salary'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalBaseSalary, lang)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className={`bg-gradient-to-r from-[#4A7C59] to-[#3a6347] rounded-xl shadow-sm p-3.5 sm:p-4 text-white w-full sm:max-w-sm ${isRTL ? 'sm:mr-auto' : 'sm:ml-auto'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#e2e8f0] text-[10px] uppercase tracking-wider mb-0.5">
                {lang === 'ar' ? 'إجمالي الرواتب المستحقة' : 'Total Salaries Due'}
              </p>
              <p className="text-xl font-bold">{formatSalary(totalNetSalary, lang)}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'الموظف' : 'Employee'}
                </th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'القسم' : 'Department'}
                </th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'الراتب الأساسي' : 'Base Salary'}
                </th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'الخصومات' : 'Deductions'}
                </th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'المكافآت' : 'Incentives'}
                </th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? 'صافي الراتب' : 'Net Salary'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4A4E4A]/10 flex items-center justify-center text-[#4A4E4A] font-bold text-xs">
                        {String(record.employeeName || 'Unknown').charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{typeof record.employeeName === 'string' ? record.employeeName : 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{record.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-800">{formatSalary(record.baseSalary, lang)}</td>
                  <td className="px-5 py-4 text-sm text-[#6B6358]">- {formatSalary(record.deductions, lang)}</td>
                  <td className="px-5 py-4 text-sm text-[#4A7C59]">+ {formatSalary(record.bonuses, lang)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatSalary(record.netSalary, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && <EmptyState isAr={lang === 'ar'} />}
      </div>

      {showHistory && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {lang === 'ar' ? 'سجل المكافآت والخصومات' : 'Incentives & Deductions History'}
            </h3>
            <button onClick={() => setShowHistory(false)} className="text-sm text-[#C4A66A] hover:text-[#b09355] font-medium">
              {lang === 'ar' ? 'إخفاء السجل' : 'Hide History'}
            </button>
          </div>

          {historyItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{lang === 'ar' ? 'لم يتم العثور على سجلات' : 'No history found'}</p>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[650px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? 'الموظف' : 'Employee'}
                      </th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? 'النوع' : 'Type'}
                      </th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? 'المبلغ' : 'Amount'}
                      </th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? 'السبب' : 'Reason'}
                      </th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? 'التاريخ' : 'Date'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentHistoryItems.map((item) => (
                      <tr key={`${item.type}-${item.id}`}>
                        <td className="px-5 py-3 text-sm text-gray-800">{item.name || item.user?.full_name || `User #${item.user_id || 'Unknown'}`}</td>
                        <td className="px-5 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'incentive' ? 'bg-[#4A7C59]/10 text-[#4A7C59]' : 'bg-[#6B6358]/10 text-[#6B6358]'
                            }`}>
                            {item.type === 'incentive' ? (lang === 'ar' ? 'مكافأة' : 'Incentive') : (lang === 'ar' ? 'خصم' : 'Deduction')}
                          </span>
                        </td>
                        <td className={`px-5 py-3 text-sm font-semibold ${item.type === 'incentive' ? 'text-[#4A7C59]' : 'text-[#6B6358]'
                          }`}>
                          {item.type === 'incentive' ? '+' : '-'} {formatSalary(item.amount, lang)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">{item.reason || '-'}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 mt-4">
                <span className="text-sm text-gray-500">
                  {lang === 'ar'
                    ? `عرض ${(historyPage - 1) * itemsPerPage + 1} إلى ${Math.min(historyPage * itemsPerPage, historyItems.length)} من أصل ${historyItems.length} سجل`
                    : `Showing ${(historyPage - 1) * itemsPerPage + 1} to ${Math.min(historyPage * itemsPerPage, historyItems.length)} of ${historyItems.length} entries`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {lang === 'ar' ? `صفحة ${historyPage} من ${totalHistoryPages}` : `Page ${historyPage} of ${totalHistoryPages}`}
                  </span>
                  <button
                    onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                    disabled={historyPage === totalHistoryPages}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}      {showIncentiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {lang === 'ar' ? 'إضافة مكافأة جديدة' : 'Create Incentive'}
              </h3>
              <button onClick={() => setShowIncentiveModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'الموظف *' : 'Employee *'}
                </label>
                <select
                  value={newIncentive.user_id}
                  onChange={(e) =>
                    setNewIncentive({
                      ...newIncentive,
                      user_id: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value={0}>{lang === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
                  {employees.map((emp: { id: number; full_name?: string; name?: string }) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'المبلغ (ل.س)' : 'Amount (SYP)'}
                </label>
                <input
                  type="number"
                  value={newIncentive.amount}
                  onChange={(e) =>
                    setNewIncentive({
                      ...newIncentive,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'السبب' : 'Reason'}
                </label>
                <input
                  type="text"
                  value={newIncentive.reason}
                  onChange={(e) =>
                    setNewIncentive({ ...newIncentive, reason: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={newIncentive.date}
                  onChange={(e) =>
                    setNewIncentive({ ...newIncentive, date: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => setShowIncentiveModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreateIncentive}
                  className="px-5 py-2 bg-[#4A7C59] text-white rounded-lg hover:bg-[#3a6347]"
                >
                  {lang === 'ar' ? 'إضافة' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}      {showDeductionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir={isRTL ? "rtl" : "ltr"}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {lang === 'ar' ? 'إضافة خصم جديد' : 'Create Deduction'}
              </h3>
              <button onClick={() => setShowDeductionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'الموظف *' : 'Employee *'}
                </label>
                <select
                  value={newDeduction.user_id}
                  onChange={(e) =>
                    setNewDeduction({
                      ...newDeduction,
                      user_id: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value={0}>{lang === 'ar' ? 'اختر الموظف' : 'Select Employee'}</option>
                  {employees.map((emp: { id: number; full_name?: string; name?: string }) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'المبلغ (ل.س)' : 'Amount (SYP)'}
                </label>
                <input
                  type="number"
                  value={newDeduction.amount}
                  onChange={(e) =>
                    setNewDeduction({
                      ...newDeduction,
                      amount: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'السبب' : 'Reason'}
                </label>
                <input
                  type="text"
                  value={newDeduction.reason}
                  onChange={(e) =>
                    setNewDeduction({ ...newDeduction, reason: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {lang === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={newDeduction.date}
                  onChange={(e) =>
                    setNewDeduction({ ...newDeduction, date: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={() => setShowDeductionModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreateDeduction}
                  className="px-5 py-2 bg-[#6B6358] text-white rounded-lg hover:bg-[#5a5348]"
                >
                  {lang === 'ar' ? 'إضافة' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}