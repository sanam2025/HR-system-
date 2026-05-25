// core/modules/HR/pages/Employees.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Filter, UserCheck, UserX, Eye, Edit, Trash2, Users as UsersIcon } from "lucide-react";
import EmployeeStatusBadge from "../Components/Special_Components/EmployeeStatusBadge";
import type { Employee } from "../types/employee.types";

// Mock data
const mockEmployees: Employee[] = [
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
    name: "Zena Al-Ali",
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
];

const getUniqueDepartments = (employees: Employee[]) => {
  const departments = [...new Set(employees.map((emp) => emp.department))];
  return departments.map((dept) => ({ value: dept, label: dept }));
};

const getStats = (employees: Employee[]) => ({
  total: employees.length,
  active: employees.filter((e) => e.status === "active").length,
  onLeave: employees.filter((e) => e.status === "onLeave").length,
  inactive: employees.filter((e) => e.status === "inactive").length,
});

// Stat Card Component
const StatCard = ({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) => {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    gray: "from-gray-500 to-gray-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-2xl shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default function Employees() {
  const navigate = useNavigate();
  const departments = getUniqueDepartments(mockEmployees);
  const stats = getStats(mockEmployees);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      searchTerm === "" ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "" || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewEmployee = (employee: Employee) => {
    navigate(`/Hr/employees/view/${employee.id}`);
  };

  const handleEditEmployee = (employee: Employee) => {
    navigate(`/Hr/employees/edit/${employee.id}`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete employee ${employee.name}?`)) {
      console.log("Delete employee:", employee);
      alert(`Employee ${employee.name} has been deleted successfully`);
    }
  };

  const handleExportData = () => {
    const headers = ["Employee Number", "Name", "Email", "Department", "Job Title", "Status"];
    const rows = filteredEmployees.map(emp => [
      emp.employeeNumber,
      emp.name,
      emp.email,
      emp.department,
      emp.jobTitle,
      emp.status === "active" ? "Active" : emp.status === "onLeave" ? "On Leave" : "Inactive"
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
    
    alert("Data exported successfully");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("");
  };

  const ActionButtons = ({ employee }: { employee: Employee }) => (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => handleViewEmployee(employee)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditEmployee(employee)}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteEmployee(employee)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage university employee data and records.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.total}
          color="blue"
          icon={<UsersIcon className="w-5 h-5" />}
        />
        <StatCard
          title="Active"
          value={stats.active}
          color="green"
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          color="yellow"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Inactive"
          value={stats.inactive}
          color="gray"
          icon={<UserX className="w-5 h-5" />}
        />
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-700">Filter Results</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, department, or job title..."
              className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm min-w-[180px]"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="onLeave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary & Export */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{mockEmployees.length}</span> employees
          </p>
          {filteredEmployees.length !== mockEmployees.length && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Number</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => handleViewEmployee(employee)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{employee.employeeNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{employee.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.jobTitle}</td>
                  <td className="px-6 py-4">
                    <EmployeeStatusBadge status={employee.status} />
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons employee={employee} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-2">
              <UsersIcon className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500">No employees found</p>
            <button
              onClick={clearAllFilters}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}