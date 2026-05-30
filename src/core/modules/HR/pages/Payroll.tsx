// core/modules/HR/pages/Payroll.tsx
import React, { useState } from "react";
import { DollarSign, Wallet, TrendingUp, TrendingDown, Users, FileText, CheckCircle } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import {PayrollTableRow} from "../Components/Special_Components/PayrollTableRow";
import type { PayrollRecord, PayrollStatus, PayrollSummary } from "../types/payroll.types";
import { calculatePayrollSummary, formatSalary } from "../types/payroll.types";

// ============= Data (Static) =============

const payrollRecords: PayrollRecord[] = [
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
];

// Current month and year
const currentMonth = "April";
const currentYear = 2026;

// ============= Main Component =============

export default function Payroll() {
  const [records, setRecords] = useState<PayrollRecord[]>(payrollRecords);
  const summary: PayrollSummary = calculatePayrollSummary(records);

  const handleView = (record: PayrollRecord) => {
    console.log("View record:", record);
  };

  const handleEdit = (record: PayrollRecord) => {
    console.log("Edit record:", record);
  };

  const handleStatusChange = (record: PayrollRecord, newStatus: PayrollStatus) => {
    setRecords(prev =>
      prev.map(r =>
        r.id === record.id ? { ...r, status: newStatus } : r
      )
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
            <span className="text-sm font-medium text-gray-700">{currentMonth} {currentYear}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Card - Total Salaries */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Salaries Due</p>
              <p className="text-3xl font-bold">{formatSalary(summary.totalNetSalary)}</p>
              <p className="text-blue-100 text-xs mt-2">{currentMonth} {currentYear}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Employees"
          value={summary.totalCount}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Paid"
          value={summary.paidCount}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Issued"
          value={summary.issuedCount}
          icon={<FileText className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Draft"
          value={summary.draftCount}
          icon={<FileText className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Bonuses</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(summary.totalBonuses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Deductions</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(summary.totalDeductions)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Base Salary</p>
              <p className="text-lg font-bold text-gray-800">{formatSalary(summary.totalBaseSalary)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Salary</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Salary</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
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
        {records.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No payroll records found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Calendar Icon component (since we need it separately)
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);