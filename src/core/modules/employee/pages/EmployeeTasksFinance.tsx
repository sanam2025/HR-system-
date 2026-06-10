import { PayslipCard, AssignedTasksCard } from "../components/speciel-components/TasksFinanceComponents";
import { mockTasksFinanceData } from "../data/mockEmployeeData";

export default function EmployeeTasksFinance() {
  const data = mockTasksFinanceData;
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-dark">Tasks & Financial Services</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your tasks and view your payslip</p>
        </div>
        <button className="px-5 py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors flex-shrink-0 whitespace-nowrap">
          Submit Resignation Request
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PayslipCard data={data.payslip} />
        <AssignedTasksCard tasks={data.assignedTasks} />
      </div>
    </div>
  );
}
