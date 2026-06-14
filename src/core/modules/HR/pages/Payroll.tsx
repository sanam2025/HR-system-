// core/modules/HR/pages/Payroll.tsx
import React, { useState } from "react";
import { DollarSign, Wallet, TrendingUp, TrendingDown, Users, FileText, CheckCircle } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import { PayrollTableRow } from "../Components/Special_Components/PayrollTableRow";
import type { PayrollRecord, PayrollStatus, PayrollSummary } from "../types/payroll.types";
import { calculatePayrollSummary, formatSalary } from "../types/payroll.types";

// ============= Constants (رفع البيانات خارج المكون) =============
const PAYROLL_DATA: PayrollRecord[] = [
  {
    id: "1",
    employeeName: "Mohammed Al-Hassan",
    department: "Information Technology Engineering",
    baseSalary: 850000,
    deductions: 47500,
    bonuses: 0,
    netSalary: 802500,
    status: "paid",
    month: "April",
    year: 2026,
  },
  {
    id: "2",
    employeeName: "Rana Al-Ali",
    department: "Basic Sciences",
    baseSalary: 920000,
    deductions: 88000,
    bonuses: 0,
    netSalary: 832000,
    status: "issued",
    month: "April",
    year: 2026,
  },
  {
    id: "3",
    employeeName: "Wael Al-Masri",
    department: "Electrical Engineering",
    baseSalary: 1100000,
    deductions: 0,
    bonuses: 35000,
    netSalary: 1135000,
    status: "draft",
    month: "April",
    year: 2026,
  },
  {
    id: "4",
    employeeName: "Karim Salman",
    department: "Student Affairs",
    baseSalary: 650000,
    deductions: 47500,
    bonuses: 0,
    netSalary: 602500,
    status: "issued",
    month: "April",
    year: 2026,
  },
] as const;

const CURRENT_MONTH = "April";
const CURRENT_YEAR = 2026;

// ============= Stats Cards Configuration (الألوان المتاحة فقط) =============
const STATS_CARDS_CONFIG = [
  { key: "totalCount" as const, title: "Total Employees", icon: Users, color: "blue" as const },
  { key: "paidCount" as const, title: "Paid", icon: CheckCircle, color: "green" as const },
  { key: "issuedCount" as const, title: "Issued", icon: FileText, color: "teal" as const },  // changed from purple to teal
  { key: "draftCount" as const, title: "Draft", icon: FileText, color: "orange" as const },
] as const;

// ============= Secondary Stats Configuration =============
const SECONDARY_STATS_CONFIG = [
  { key: "totalBonuses" as const, title: "Total Bonuses", icon: TrendingUp, bgColor: "bg-emerald-100", iconColor: "text-emerald-600" },
  { key: "totalDeductions" as const, title: "Total Deductions", icon: TrendingDown, bgColor: "bg-red-100", iconColor: "text-red-600" },
  { key: "totalBaseSalary" as const, title: "Total Base Salary", icon: DollarSign, bgColor: "bg-blue-100", iconColor: "text-blue-600" },
] as const;

// ============= Table Columns Configuration =============
const TABLE_COLUMNS = [
  { key: "employee", label: "Employee", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "department", label: "Department", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "baseSalary", label: "Base Salary", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "netSalary", label: "Net Salary", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "status", label: "Status", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "actions", label: "Actions", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
] as const;

// ============= Helper Functions =============
const getStatsList = (summary: PayrollSummary) => 
  STATS_CARDS_CONFIG.map(({ key, title, icon, color }) => ({
    title,
    value: summary[key],
    icon,
    color,
  }));

const getSecondaryStatsList = (summary: PayrollSummary) =>
  SECONDARY_STATS_CONFIG.map(({ key, title, icon: Icon, bgColor, iconColor }) => ({
    title,
    value: summary[key],
    icon: Icon,
    bgColor,
    iconColor,
  }));

// ============= Components =============
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TotalSalariesCard: React.FC<{ total: number; month: string; year: number }> = ({ total, month, year }) => (
  <div className="mb-8">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm mb-1">Total Salaries Due</p>
          <p className="text-3xl font-bold">{formatSalary(total)}</p>
          <p className="text-blue-100 text-xs mt-2">{month} {year}</p>
        </div>
        <div className="bg-white/20 p-4 rounded-2xl">
          <Wallet className="w-8 h-8" />
        </div>
      </div>
    </div>
  </div>
);

const StatsCards: React.FC<{ statsList: Array<{ title: string; value: number; icon: React.ElementType; color: "blue" | "green" | "orange" | "red" | "teal" }> }> = ({ statsList }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    {statsList.map(({ title, value, icon: Icon, color }) => (
      <StatCard key={title} title={title} value={value} icon={<Icon className="w-5 h-5" />} color={color} />
    ))}
  </div>
);

const SecondaryStats: React.FC<{ statsList: Array<{ title: string; value: number; icon: React.ElementType; bgColor: string; iconColor: string }> }> = ({ statsList }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
    {statsList.map(({ title, value, icon: Icon, bgColor, iconColor }) => (
      <div key={title} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-lg font-bold text-gray-800">{formatSalary(value)}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
    <p className="text-sm text-gray-400">No payroll records found</p>
  </div>
);

// ============= Main Component =============
export default function Payroll() {
  const [records, setRecords] = useState<PayrollRecord[]>(PAYROLL_DATA as PayrollRecord[]);
  const summary: PayrollSummary = calculatePayrollSummary(records);

  const statsList = getStatsList(summary);
  const secondaryStatsList = getSecondaryStatsList(summary);

  const handleView = (record: PayrollRecord) => {
    console.log("View record:", record);
  };

  const handleEdit = (record: PayrollRecord) => {
    console.log("Edit record:", record);
  };

  const handleStatusChange = (record: PayrollRecord, newStatus: PayrollStatus) => {
    setRecords(prev =>
      prev.map(r => r.id === record.id ? { ...r, status: newStatus } : r)
    );
    console.log(`Record ${record.id} status changed to ${newStatus}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage employee salaries, deductions, and bonuses.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">{CURRENT_MONTH} {CURRENT_YEAR}</span>
          </div>
        </div>
      </div>

      {/* Total Salaries Card */}
      <TotalSalariesCard total={summary.totalNetSalary} month={CURRENT_MONTH} year={CURRENT_YEAR} />

      {/* Stats Cards */}
      <StatsCards statsList={statsList} />

      {/* Secondary Stats */}
      <SecondaryStats statsList={secondaryStatsList} />

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                {TABLE_COLUMNS.map((col) => (
                  <th key={col.key} className={col.className}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.map((record) => (
                <PayrollTableRow
                  key={record.id}
                  record={record}
                  onView={handleView}
                  onEdit={handleEdit}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {records.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}