import { Plus } from 'lucide-react'
import type { Payrolls } from '../../types/types';


type PayrollTableProps = {
    payrollHistory: Payrolls[] | undefined;
}

function PayrollTable({
    payrollHistory
}: PayrollTableProps) {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="font-semibold text-gray-800">All Payroll Records</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 text-sm">
        <Plus className="w-4 h-4" />
        Generate Payroll for {currentMonth} {currentYear}
        </button>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Month
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Year
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Salary
            </th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
            {payrollHistory?.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">#{payroll.id}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                {new Date(payroll.year, payroll.month - 1).toLocaleString(
                    "default",
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
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        payroll.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-yellow-500"
                    }`}
                    ></span>
                    {payroll.status}
                </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                ${payroll.total_salary.toLocaleString()}
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  )
}

export default PayrollTable