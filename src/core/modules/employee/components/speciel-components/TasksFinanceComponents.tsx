import { Download, Wallet } from "lucide-react";
import { Badge } from "../commend-components";
import { TaskStatus } from "../../types";
import type { Payslip, AssignedTask } from "../../types";

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} SAR`;
}

function PayslipRow({
  label,
  amount,
  amountColor,
  prefix = "",
}: {
  label: string;
  amount: number;
  amountColor: string;
  prefix?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium whitespace-nowrap ml-4 ${amountColor}`}>
        {prefix}{formatCurrency(amount)}
      </span>
    </div>
  );
}

export function PayslipCard({ data }: { data: Payslip }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in">
      <header className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="text-sm font-semibold text-dark">Monthly Payslip</h3>
          <p className="text-xs text-gray-400">{data.month} {data.year}</p>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-xl bg-green-light flex items-center justify-center hover:bg-green/20 transition-colors flex-shrink-0"
          aria-label={`Download payslip for ${data.month} ${data.year}`}
        >
          <Download size={18} className="text-green" />
        </button>
      </header>
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
        <PayslipRow label="Basic Salary" amount={data.basicSalary} amountColor="text-dark" />
        <PayslipRow label="Bonuses & Allowances" amount={data.bonuses} amountColor="text-green" prefix="+" />
        <PayslipRow label="Deductions" amount={data.deductions} amountColor="text-red-500" prefix="-" />
      </div>
      <footer className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Net Amount</p>
          <p className="text-lg sm:text-xl font-bold text-green-dark whitespace-nowrap">{formatCurrency(data.netAmount)}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Wallet size={20} className="text-green" />
        </div>
      </footer>
    </article>
  );
}

function TaskCard({ task, index }: { task: AssignedTask; index: number }) {
  return (
    <div className="p-4 rounded-xl bg-beige animate-slide-up-stagger" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-dark">{task.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">Due {task.dueDate}</p>
        </div>
        <Badge variant={task.status === TaskStatus.Completed ? "success" : "warning"}>
          {task.status}
        </Badge>
      </div>
    </div>
  );
}

export function AssignedTasksCard({ tasks }: { tasks: AssignedTask[] }) {
  return (
    <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">Assigned Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <TaskCard key={task.id} task={task} index={i} />
        ))}
      </div>
    </article>
  );
}
