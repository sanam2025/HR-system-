// core/modules/HR/pages/Employees.tsx
import React, { useState } from "react";
import { Download, Star } from "lucide-react";
import EvaluationModal from "../Components/Special_Components/EvaluationModal";
import type { Employee } from "../types/employee.types";

// ============= Constants (رفع البيانات خارج المكون) =============
const EMPLOYEES_DATA: Employee[] = [
  {
    id: "1",
    employeeNumber: "DU-2019-001",
    name: "Mohammed Al-Hassan",
    email: "mhassan@damascus.edu.sy",
    department: "Information Technology Engineering",
    jobTitle: "Teaching Assistant",
    status: "active",
    joinDate: "2019-09-01",
    phone: "011-1234567",
  },
  {
    id: "2",
    employeeNumber: "DU-2020-002",
    name: "Rana Al-Ali",
    email: "rali@damascus.edu.sy",
    department: "Basic Sciences",
    jobTitle: "Professor",
    status: "active",
    joinDate: "2020-09-01",
    phone: "011-2345678",
  },
  {
    id: "3",
    employeeNumber: "DU-2018-003",
    name: "Wael Al-Masri",
    email: "wmasri@damascus.edu.sy",
    department: "Electrical Engineering",
    jobTitle: "Department Head",
    status: "active",
    joinDate: "2018-09-01",
    phone: "011-3456789",
  },
  {
    id: "4",
    employeeNumber: "DU-2021-004",
    name: "Lama Al-Zoubi",
    email: "lzaabi@damascus.edu.sy",
    department: "Administration and Planning",
    jobTitle: "Project Manager",
    status: "onLeave",
    joinDate: "2021-09-01",
    phone: "011-4567890",
  },
  {
    id: "5",
    employeeNumber: "DU-2022-005",
    name: "Karim Salman",
    email: "ksalman@damascus.edu.sy",
    department: "Student Affairs",
    jobTitle: "Student Supervisor",
    status: "active",
    joinDate: "2022-09-01",
    phone: "011-5678901",
  },
  {
    id: "6",
    employeeNumber: "DU-2017-006",
    name: "Hana Ibrahim",
    email: "hibrahim@damascus.edu.sy",
    department: "Library and Information",
    jobTitle: "Librarian",
    status: "inactive",
    joinDate: "2017-09-01",
    phone: "011-6789012",
  },
  {
    id: "7",
    employeeNumber: "DU-2023-007",
    name: "Basel Khalid",
    email: "bkhaled@damascus.edu.sy",
    department: "Information Technology Engineering",
    jobTitle: "Assistant Professor",
    status: "active",
    joinDate: "2023-09-01",
    phone: "011-7890123",
  },
  {
    id: "8",
    employeeNumber: "DU-2016-008",
    name: "Rana Shahada",
    email: "rshahada@damascus.edu.sy",
    department: "Basic Sciences",
    jobTitle: "Doctor Professor",
    status: "active",
    joinDate: "2016-09-01",
    phone: "011-8901234",
  },
] as const;

// ============= Table Columns Configuration =============
const TABLE_COLUMNS = [
  { key: "employeeNumber", label: "Employee Number", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "employee", label: "Employee", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "department", label: "Department", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "jobTitle", label: "Job Title", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
  { key: "actions", label: "Actions", className: "text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider" },
] as const;

// ============= Helper Functions =============
const getStatusText = (status: string): string => {
  if (status === "active") return "Active";
  if (status === "onLeave") return "On Leave";
  return "Inactive";
};

const exportToCSV = (employees: Employee[]) => {
  const headers = ["Employee Number", "Name", "Email", "Department", "Job Title", "Status"];
  const rows = employees.map(emp => [
    emp.employeeNumber,
    emp.name,
    emp.email,
    emp.department,
    emp.jobTitle,
    getStatusText(emp.status),
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "employees.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============= Employee Row Component =============
const EmployeeRow: React.FC<{ employee: Employee; onEvaluate: (employee: Employee) => void }> = ({ 
  employee, 
  onEvaluate 
}) => {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3.5">
        <span className="text-sm font-medium text-gray-800">{employee.employeeNumber}</span>
      </td>
      <td className="px-5 py-3.5">
        <div>
          <div className="text-sm font-medium text-gray-800">{employee.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{employee.email}</div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{employee.department}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{employee.jobTitle}</td>
      <td className="px-5 py-3.5">
        <button
          onClick={() => onEvaluate(employee)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <Star className="w-4 h-4" />
          Evaluate
        </button>
      </td>
    </tr>
  );
};

// ============= Main Component =============
export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  const handleExport = () => {
    exportToCSV(EMPLOYEES_DATA as Employee[]);
    alert("Data exported successfully");
  };

  const handleEvaluate = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEvaluationOpen(true);
  };

  const handleSaveEvaluation = (employeeId: string, rating: number, comments: string) => {
    console.log("Evaluation saved:", { employeeId, rating, comments });
    alert(`✅ Evaluation saved for ${selectedEmployee?.name}\nRating: ${rating}/5\nComments: ${comments || "No comments"}`);
    setIsEvaluationOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvaluationOpen}
        employee={selectedEmployee}
        onClose={() => setIsEvaluationOpen(false)}
        onSave={handleSaveEvaluation}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage university employee data and records.</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{EMPLOYEES_DATA.length}</span> employees
        </p>
      </div>

      {/* Employees Table */}
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
              {(EMPLOYEES_DATA as Employee[]).map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onEvaluate={handleEvaluate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}