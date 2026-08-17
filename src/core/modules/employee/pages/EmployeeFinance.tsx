import {
  useCurrentPayroll,
  useMyBaseSalaries,
  useMyDeductions,
  useMyIncentives,
  useMyPayslips,
  usePayslipsSummary,
  useDownloadPayslip,
  usePreviewPayslip,
} from "../../../../api/hooks/useFinance";
import { Badge, LoadingSkeleton, QueryErrorNotice, StatCard } from "../components/commend-components";
import { ApiError } from "../../../../lib/http/ApiError";
import { Wallet, TrendingDown, TrendingUp, FileText } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amount);
}

function CurrentPayrollCard() {
  const payroll = useCurrentPayroll();

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Current Payroll</h2>
      {payroll.isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : payroll.isError ? (
        <QueryErrorNotice message={(payroll.error as ApiError).message} />
      ) : payroll.data ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Wallet} label="Net amount" value={formatCurrency(payroll.data.net_amount)} />
          <StatCard icon={TrendingUp} label="Base" value={formatCurrency(payroll.data.base_amount)} />
          <StatCard icon={TrendingUp} label="Incentives" value={formatCurrency(payroll.data.incentives_total)} />
          <StatCard icon={TrendingDown} label="Deductions" value={formatCurrency(payroll.data.deductions_total)} />
        </div>
      ) : (
        <p className="text-sm text-gray-400">No current payroll available.</p>
      )}
    </article>
  );
}

function PayslipsCard() {
  const payslips = useMyPayslips();
  const summary = usePayslipsSummary();
  const downloadPayslip = useDownloadPayslip();
  const previewPayslip = usePreviewPayslip();
  const items = payslips.data?.items ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-dark">My Payslips</h2>
        {summary.data && (
          <span className="text-xs text-gray-400">
            {summary.data.count} total · {formatCurrency(summary.data.total_net)}
          </span>
        )}
      </div>
      {payslips.isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : payslips.isError ? (
        <QueryErrorNotice message={(payslips.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No payslips yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((payslip) => (
            <div
              key={payslip.id}
              className="flex flex-wrap items-center justify-between gap-2 text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2 text-dark font-medium">
                <FileText size={14} className="text-gray-400" aria-hidden="true" />
                {payslip.period_start} → {payslip.period_end}
              </div>
              <span className="text-gray-400">{formatCurrency(payslip.net_amount)}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => previewPayslip.mutate(payslip.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-green-dark bg-green-light hover:bg-green-light/70 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => downloadPayslip.mutate(payslip.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-dark bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {(downloadPayslip.isError || previewPayslip.isError) && (
        <div className="mt-3">
          <QueryErrorNotice
            message={
              ((downloadPayslip.error ?? previewPayslip.error) as ApiError).message
            }
          />
        </div>
      )}
    </article>
  );
}

function BaseSalariesCard() {
  const baseSalaries = useMyBaseSalaries();
  const items = baseSalaries.data?.items ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Base Salary History</h2>
      {baseSalaries.isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : baseSalaries.isError ? (
        <QueryErrorNotice message={(baseSalaries.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No base salary records yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">{entry.effective_date}</span>
              <span className="text-gray-400">{formatCurrency(entry.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function DeductionsCard() {
  const deductions = useMyDeductions();
  const items = deductions.data?.items ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Deductions</h2>
      {deductions.isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : deductions.isError ? (
        <QueryErrorNotice message={(deductions.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No deductions on record.</p>
      ) : (
        <div className="space-y-2">
          {items.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-dark font-medium">{entry.reason}</p>
                <p className="text-xs text-gray-400">{entry.date}</p>
              </div>
              <Badge variant="danger">-{formatCurrency(entry.amount)}</Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function IncentivesCard() {
  const incentives = useMyIncentives();
  const items = incentives.data?.items ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Incentives</h2>
      {incentives.isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : incentives.isError ? (
        <QueryErrorNotice message={(incentives.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No incentives on record.</p>
      ) : (
        <div className="space-y-2">
          {items.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-dark font-medium">{entry.reason}</p>
                <p className="text-xs text-gray-400">{entry.date}</p>
              </div>
              <Badge variant="success">+{formatCurrency(entry.amount)}</Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function EmployeeFinance() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Finance</h1>
        <p className="text-sm text-gray-400 mt-1">Your payroll, payslips, deductions, and incentives.</p>
      </div>
      <CurrentPayrollCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <PayslipsCard />
          <BaseSalariesCard />
        </div>
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <DeductionsCard />
          <IncentivesCard />
        </div>
      </div>
    </div>
  );
}
