// src/core/modules/HR/pages/Payroll/Payroll.tsx
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

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
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

const EmptyState = () => {
  const { t } = useLanguage();
  return (
    <div className="text-center py-12">
      <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-gray-400">{t.hrPayroll?.emptyState || 'No payroll records found'}</p>
    </div>
  );
};

export default function Payroll() {
  // ------------------- Hooks -------------------
  const { incentives } = useIncentives();
  const { deductions } = useDeductions();
  const createIncentive = useCreateIncentive();
  const createDeduction = useCreateDeduction();
  const { currentUser } = useAuthStore();
  const { t, lang } = useLanguage();

  // ------------------- Local States -------------------
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  //  إعادة تفعيل employees وتعريفه بنوع صحيح
  const [employees, setEmployees] = useState<{ id: number; full_name?: string; name?: string }[]>([]);
  
  const [showIncentiveModal, setShowIncentiveModal] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);

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
  });

  // ------------------- جلب البيانات -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        //  جلب الموظفين (للاستخدام في الـ Dropdown)
        const empRes = await apiClient.get("/users/employees");
        if (empRes.data?.data) setEmployees(empRes.data.data);

        // جلب كشف الرواتب الحالي — مع التمييز بين HR وغيرها
        try {
          const userRole = currentUser?.role?.toLowerCase() || '';
          const isHr = userRole.includes('hr');

          let payslips: any[] = [];
          if (isHr) {
            const payslipsRes = await PayrollsService.getCurrentMonthPayslips();
            payslips = payslipsRes.data?.data || payslipsRes.data || [];
          } else {
            const payrollRes = await PayrollsService.getCurrentPayroll();
            payslips = payrollRes.data?.data || [];
          }
          
          if (payslips.length > 0) {
            // تحويل بيانات payslips إلى تنسيق PayrollRecord
              const mapped = Array.isArray(payslips) ? payslips.map((p: any) => ({
                id: p.id || p.user_id || p.employee_id || Math.random(),
                employeeName: p.employeeName || p.employee?.full_name || p.employee?.name || p.user?.full_name || p.user?.name || p.full_name || p.name || 'Unknown',
                department: p.department?.name || p.department || p.user?.department?.name || p.user?.department || p.department_name || 'Unknown',
                baseSalary: Number(p.base_salary || p.gross_salary || p.baseSalary || p.basic_salary || p.salary || p.gross_amount || 0),
                bonuses: Number(p.incentives_total || p.incentives || p.bonuses || p.total_incentives || p.total_bonuses || p.incentive_amount || 0),
                deductions: Number(p.deductions_total || p.deductions || p.total_deductions || p.deduction_amount || 0),
                netSalary: Number(p.net_salary || p.netSalary || p.net_total || p.net_amount || p.net || 0),
                month: p.month || String(new Date().getMonth() + 1),
                year: p.year || new Date().getFullYear(),
                status: p.status || 'generated',
              })) : [];
              setRecords(mapped);
          }
        } catch (error: any) {
          if (error?.response?.status !== 403) {
            toast.error(t.hrPayroll?.toasts?.loadError || "Failed to load payroll data");
          }
        }
      } catch (error: any) {
        // Handle generic fetch errors
      }
    };
    fetchData();
  }, [currentUser]);


  // ------------------- Handlers -------------------
  const handleCreateIncentive = () => {
    if (!newIncentive.user_id) {
      toast.error(t.hrPayroll?.toasts?.selectEmployee || "Please select an employee");
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
      toast.error(t.hrPayroll?.toasts?.selectEmployee || "Please select an employee");
      return;
    }
    createDeduction.mutate(newDeduction, {
      onSuccess: () => {
        setShowDeductionModal(false);
        setNewDeduction({ user_id: 0, amount: 0, reason: "", date: new Date().toISOString().split("T")[0] });
      },
    });
  };

  // ------------------- Calculations -------------------
  const totalBaseSalary = records.reduce((acc, r) => acc + (Number(r.baseSalary) || 0), 0);
  const totalIncentives = incentives.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalDeductions = deductions.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
  const totalNetSalary = records.reduce((acc, r) => acc + (Number(r.netSalary) || 0), 0);

  // ------------------- History Pagination -------------------
  const historyItems = useMemo(() => {
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
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.hrPayroll?.title || 'Payroll Management'}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {t.hrPayroll?.subtitle || 'Manage employee salaries, incentives, and deductions.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setShowIncentiveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> {t.hrPayroll?.createIncentive || 'Create Incentive'}
            </button>
            <button 
              onClick={() => setShowDeductionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> {t.hrPayroll?.createDeduction || 'Create Deduction'}
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <List className="w-4 h-4" /> {showHistory ? (t.hrPayroll?.hideHistory || 'Hide History') : (t.hrPayroll?.history || 'History')}
            </button>
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">{t.hrPayroll?.totalSalariesDue || 'Total Salaries Due'}</p>
              <p className="text-3xl font-bold">{formatSalary(totalNetSalary)}</p>
              <p className="text-blue-100 text-xs mt-2">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t.hrPayroll?.totalEmployees || 'Total Employees'}</p>
              <p className="text-lg font-bold text-gray-800">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t.hrPayroll?.totalIncentives || 'Total Incentives'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalIncentives)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t.hrPayroll?.totalDeductions || 'Total Deductions'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalDeductions)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{t.hrPayroll?.baseSalary || 'Base Salary'}</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(totalBaseSalary)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.employee || 'Employee'}</th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.department || 'Department'}</th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.baseSalary || 'Base Salary'}</th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.deductions || 'Deductions'}</th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.incentives || 'Incentives'}</th>
                <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.netSalary || 'Net Salary'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {String(record.employeeName || 'Unknown').charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{typeof record.employeeName === 'string' ? record.employeeName : 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{record.department}</td>
                  <td className="px-5 py-4 text-sm text-gray-800">{formatSalary(record.baseSalary)}</td>
                  <td className="px-5 py-4 text-sm text-red-600">- {formatSalary(record.deductions)}</td>
                  <td className="px-5 py-4 text-sm text-emerald-600">+ {formatSalary(record.bonuses)}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">{formatSalary(record.netSalary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && <EmptyState />}
      </div>

      {showHistory && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-800"> {t.hrPayroll?.incentivesDeductionsHistory || 'Incentives & Deductions History'}</h3>
            <button onClick={() => setShowHistory(false)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              {t.hrPayroll?.hideHistory || 'Hide History'}
            </button>
          </div>

          {historyItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">{t.hrPayroll?.noHistory || 'No history found'}</p>
          ) : (
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.employee || 'Employee'}</th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.type || 'Type'}</th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.amount || 'Amount'}</th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.reason || 'Reason'}</th>
                      <th className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrPayroll?.table?.date || 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentHistoryItems.map((item) => (
                      <tr key={`${item.type}-${item.id}`}>
                        <td className="px-5 py-3 text-sm text-gray-800">{item.name || item.user?.full_name || `User #${item.user_id || 'Unknown'}`}</td>
                        <td className="px-5 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'incentive' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {item.type === 'incentive' ? (t.hrPayroll?.table?.incentives || 'Incentive') : (t.hrPayroll?.table?.deductions || 'Deduction')}
                          </span>
                        </td>
                        <td className={`px-5 py-3 text-sm font-semibold ${
                          item.type === 'incentive' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {item.type === 'incentive' ? '+' : '-'} {formatSalary(item.amount)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">{item.reason || '-'}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 mt-4">
                <span className="text-sm text-gray-500">
                  {t.hrPayroll?.showing || 'Showing'} {(historyPage - 1) * itemsPerPage + 1} {t.hrPayroll?.to || 'to'} {Math.min(historyPage * itemsPerPage, historyItems.length)} {t.hrPayroll?.of || 'of'} {historyItems.length} {t.hrPayroll?.entries || 'entries'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {t.hrPayroll?.page || 'Page'} {historyPage} {t.hrPayroll?.of || 'of'} {totalHistoryPages}
                  </span>
                  <button
                    onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                    disabled={historyPage === totalHistoryPages}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Incentive */}
      {showIncentiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t.hrPayroll?.modal?.createIncentiveTitle || 'Create Incentive'}</h3>
              <button onClick={() => setShowIncentiveModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.hrPayroll?.modal?.employee || 'Employee *'}</label>
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
                  <option value={0}>{t.hrPayroll?.modal?.selectEmployee || 'Select Employee'}</option>
                  {/*  تصحيح: employees معرفة الآن، وتم إزالة any بوضع النوع مباشرة */}
                  {employees.map((emp: { id: number; full_name?: string; name?: string }) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.hrPayroll?.modal?.amount || 'Amount (SYP)'}
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
                  {t.hrPayroll?.modal?.reason || 'Reason'}
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
                  {t.hrPayroll?.modal?.date || 'Date'}
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
                  {t.hrPayroll?.modal?.cancel || 'Cancel'}
                </button>
                <button
                  onClick={handleCreateIncentive}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  {t.hrPayroll?.modal?.create || 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Deduction */}
      {showDeductionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">{t.hrPayroll?.modal?.createDeductionTitle || 'Create Deduction'}</h3>
              <button onClick={() => setShowDeductionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.hrPayroll?.modal?.employee || 'Employee *'}</label>
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
                  <option value={0}>{t.hrPayroll?.modal?.selectEmployee || 'Select Employee'}</option>
                  {/*  تصحيح: employees معرفة الآن، وتم إزالة any بوضع النوع مباشرة */}
                  {employees.map((emp: { id: number; full_name?: string; name?: string }) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name || emp.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.hrPayroll?.modal?.amount || 'Amount (SYP)'}
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
                  {t.hrPayroll?.modal?.reason || 'Reason'}
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
                  {t.hrPayroll?.modal?.date || 'Date'}
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
                  {t.hrPayroll?.modal?.cancel || 'Cancel'}
                </button>
                <button
                  onClick={handleCreateDeduction}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {t.hrPayroll?.modal?.create || 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}