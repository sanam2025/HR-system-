import {
  useDownloadPayslip,
  useMyBaseSalaries,
  useMyDeductions,
  useMyIncentives,
  useMyPayslips,
} from "../../../../api/hooks/usePayroll";
import { useMyOvertimes, useStoreOvertimeByEmployee } from "../../../../api/hooks/useOvertime";
import {
  BaseSalaryCard,
  DeductionsCard,
  IncentivesCard,
  OvertimeCard,
  PayslipsCard,
} from "../components/speciel-components/FinanceComponents";
import { useState } from "react";
import { ApiError } from "../../../../lib/http/ApiError";
import { useLanguage } from "../../../../i18n/translations/LanguageContext";

export default function EmployeeFinance() {
  const { t } = useLanguage();
  const [deductionsPage, setDeductionsPage] = useState(1);
  const [payslipsPage, setPayslipsPage] = useState(1);

  const payslips = useMyPayslips(payslipsPage);
  const baseSalaries = useMyBaseSalaries();
  const deductions = useMyDeductions(deductionsPage);
  const incentives = useMyIncentives();
  const overtimes = useMyOvertimes();
  const downloadPayslip = useDownloadPayslip();
  const storeOvertime = useStoreOvertimeByEmployee();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">{t.finance?.title || "Finance"}</h1>
        <p className="text-sm text-gray-400 mt-1">{t.finance?.subtitle || "Payslips, base salary, deductions, incentives, and overtime."}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PayslipsCard
          payslips={payslips.data}
          isLoading={payslips.isLoading}
          errorMessage={(payslips.error as ApiError | null)?.message ?? null}
          onDownload={(id) => downloadPayslip.mutate(id)}
          downloadingId={downloadPayslip.isPending ? (downloadPayslip.variables as number) : null}
          page={payslipsPage}
          onPageChange={setPayslipsPage}
        />
        <BaseSalaryCard
          salaries={baseSalaries.data}
          isLoading={baseSalaries.isLoading}
          errorMessage={(baseSalaries.error as ApiError | null)?.message ?? null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DeductionsCard
          deductions={deductions.data}
          isLoading={deductions.isLoading}
          errorMessage={(deductions.error as ApiError | null)?.message ?? null}
          page={deductionsPage}
          onPageChange={setDeductionsPage}
        />
        <IncentivesCard
          incentives={incentives.data}
          isLoading={incentives.isLoading}
          errorMessage={(incentives.error as ApiError | null)?.message ?? null}
        />
      </div>

      <OvertimeCard
        overtimes={overtimes.data}
        isLoading={overtimes.isLoading}
        errorMessage={(overtimes.error as ApiError | null)?.message ?? null}
        onSubmit={(payload) => storeOvertime.mutate(payload)}
        isSubmitting={storeOvertime.isPending}
        submitError={(storeOvertime.error as ApiError | null)?.message ?? null}
      />
    </div>
  );
}
