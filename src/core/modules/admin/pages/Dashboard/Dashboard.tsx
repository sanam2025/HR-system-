
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../hooks/Employees/useEmployees";
import { useSettings } from "../../hooks/Settings/useSettings";
import { useTerminations } from "../../hooks/Terminations/useTerminations";
import { usePayrolls } from "../../hooks/Overview/useOverviews";
import { useDepartments } from "../../hooks/orginization/useOrginization";
import type { Employee } from "../../../../../api/Types/types.types";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { AdditionalStats } from "./cards/AdditinalStats";
import { StatsCards } from "./cards/StatsCards";
import { EmployeeStatusChart } from "./charts/EmployeeStatusChart";
import { PayrollHistoryChart } from "./charts/PayrollHistoryChart";

export default function Dashboard() {
  const { data: employeesResponse, isLoading: isLoadingEmployees } = useEmployees();
  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useDepartments();
  const { data: settingsData } = useSettings();
  const { data: payrollsResponse } = usePayrolls();
  const { data: terminationsResponse } = useTerminations();

  const mergeEmployees = (data: any): Employee[] => {
    if (!data) return [];

    if (Array.isArray(data)) return data;
    
    if (data.admin || data.HR || data.manager || data.employee) {
      return [
        ...(data.admin || []),
        ...(data.HR || []),
        ...(data.manager || []),
        ...(data.employee || [])
      ];
    }
    
    return [];
  };

  const allEmployees = mergeEmployees(employeesResponse?.data);
  
  const activeEmployees = allEmployees.filter(emp => emp?.status === 'active').length;
  const inactiveEmployees = allEmployees.filter(emp => emp?.status === 'inactive').length;
  const totalEmployees = allEmployees.length;

  const departmentsCount = departmentsResponse?.data?.length || 0;

  const attendanceRate = settingsData?.data?.grace_period ? 92 : 88;

  const pendingTerminations = terminationsResponse?.data?.filter(
    (t: any) => t?.status === 'pending'
  ).length || 0;

  const completedPayrolls = payrollsResponse?.data?.filter(
    (p: any) => p?.status === 'completed'
  ).length || 0;

  const monthlyPayrollData = payrollsResponse?.data
    ?.filter((p: any) => p?.status === 'completed')
    .slice(0, 6)
    .map((p: any) => ({
      month: new Date(p.year, p.month - 1).toLocaleString('default', { month: 'short' }),
      salary: p.total_salary,
    })) || [];

  const statusData = [];
  
  if (totalEmployees > 0) {
    if (activeEmployees > 0) {
      statusData.push({ name: 'Active', value: activeEmployees, color: '#10b981' });
    }
    if (inactiveEmployees > 0) {
      statusData.push({ name: 'Inactive', value: inactiveEmployees, color: '#ef4444' });
    }
  }

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: 'Users',
      color: 'blue',
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      icon: 'UserCheck',
      color: 'emerald',
    },
    {
      title: 'Departments',
      value: departmentsCount,
      icon: 'Building',
      color: 'purple',
    },
    {
      title: 'Pending Terminations',
      value: pendingTerminations,
      icon: 'AlertCircle',
      color: 'red',
    },
  ];

  if (isLoadingEmployees || isLoadingDepartments) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Overview of employee statistics and metrics
          </p>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EmployeeStatusChart 
          totalEmployees={totalEmployees} 
          statusData={statusData} 
        />
        <PayrollHistoryChart data={monthlyPayrollData} />
      </div>

      <AdditionalStats 
        completedPayrolls={completedPayrolls}
        attendanceRate={attendanceRate}
        inactiveEmployees={inactiveEmployees}
      />
    </div>
  );
}