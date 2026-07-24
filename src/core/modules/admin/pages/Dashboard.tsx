// core/modules/HR/pages/Dashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  DollarSign,
  UserPlus,
  BarChart,
  Clock,
  Award,
  Megaphone,
  Briefcase,
} from "lucide-react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ============= Data (Static) =============

const statsData = {
  totalEmployees: 248,
  newHires: 12,
  pendingLeaves: 8,
  pendingComplaints: 3,
  attendanceRate: "92%",
  payrollCost: "485,000 SAR",
  departments: 8,
  avgRating: 4.6,
};

const leaveRequests = [
  { name: "Rana Al-Ali", title: "Professor", department: "Basic Sciences" },
  {
    name: "Mohammed Al-Hassan",
    title: "Teaching Assistant",
    department: "Information Technology Engineering",
  },
  { name: "Sara Khan", title: "HR Manager", department: "Human Resources" },
];

const recentAnnouncements = [
  { title: "Company Meeting", date: "Mar 15, 2026", priority: "High" },
  { title: "Holiday Schedule", date: "Mar 10, 2026", priority: "Medium" },
  { title: "New Policy Update", date: "Mar 8, 2026", priority: "High" },
];

// Chart Data
const monthlyHiresData = [
  { month: "Oct", hires: 8 },
  { month: "Nov", hires: 12 },
  { month: "Dec", hires: 6 },
  { month: "Jan", hires: 15 },
  { month: "Feb", hires: 10 },
  { month: "Mar", hires: 12 },
];

const attendanceData = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 95, absent: 5 },
  { day: "Thu", present: 90, absent: 10 },
  { day: "Fri", present: 85, absent: 15 },
];

const employeeStatusData = [
  { name: "Active", value: 85, color: "#10b981" },
  { name: "On Leave", value: 10, color: "#f59e0b" },
  { name: "Inactive", value: 5, color: "#ef4444" },
];

// ============= Main Component =============

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Navigation functions
  const goToEmployees = () => navigate("/Hr/employees");
  const goToLeaves = () => navigate("/Hr/leaves");
  const goToComplaints = () => navigate("/Hr/complaints");
  const goToAttendance = () => navigate("/Hr/attendance");
  const goToPayroll = () => navigate("/Hr/payroll");
  const goToReports = () => navigate("/Hr/reports");

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('welcome')}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t('dashboardSubtitle')}
        </p>
      </div>

      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* {t('totalEmployees')} - Blue */}
        <div
          onClick={goToEmployees}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('totalEmployees')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.totalEmployees}</p>
            </div>
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* New Hires - Green */}
        <div
          onClick={goToEmployees}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('newHiresMonth')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.newHires}</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Payroll Cost - Purple */}
        <div
          onClick={goToPayroll}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('monthlyPayroll')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.payrollCost}</p>
            </div>
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* {t('attendanceRate')} - Teal */}
        <div
          onClick={goToAttendance}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('attendanceRate')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.attendanceRate}</p>
            </div>
            <div className="bg-teal-50 text-teal-600 p-3 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* {t('pendingComplaints')} - Red */}
        <div
          onClick={goToComplaints}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('pendingComplaints')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.pendingComplaints}</p>
            </div>
            <div className="bg-red-50 text-red-600 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* {t('departments')} - Indigo */}
        <div
          onClick={goToEmployees}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('departments')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.departments}</p>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Avg Rating - Yellow */}
        <div
          onClick={goToReports}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('avgEmployeeRating')}</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.avgRating}</p>
            </div>
            <div className="bg-yellow-50 text-yellow-600 p-3 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* On-Time Rate - Cyan */}
        <div
          onClick={goToAttendance}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('onTimeArrival')}</p>
              <p className="text-2xl font-bold text-gray-900">88%</p>
            </div>
            <div className="bg-cyan-50 text-cyan-600 p-3 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Hires - Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('monthlyNewHires')}
            </h3>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ReBarChart data={monthlyHiresData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hires" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend - Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('weeklyAttendanceTrend')}
            </h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Status - Pie Chart (Circle) & {t('leaveRequests')} */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('employeeStatusDistribution')}
            </h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${t(name === 'On Leave' ? 'onLeave' : name.toLowerCase())} (${value}%)`}
                  labelLine={true}
                >
                  {employeeStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {employeeStatusData.map((status, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm text-gray-600">{t(status.name === 'On Leave' ? 'onLeave' : status.name.toLowerCase())}</span>
                <span className="text-sm font-semibold text-gray-900">{status.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* {t('leaveRequests')} Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('leaveRequests')}
            </h3>
            <span
              onClick={goToLeaves}
              className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-100 transition-colors"
            >
              {statsData.pendingLeaves} {t('pending')}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {leaveRequests.map((request, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{request.name}</p>
                    <p className="text-sm text-gray-500">{request.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{request.department}</p>
                  </div>
                  <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                    {t('pending')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* {t('recentAnnouncements')} */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              {t('recentAnnouncements')}
            </h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {recentAnnouncements.map((announcement, idx) => (
            <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{announcement.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{announcement.date}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    announcement.priority === "High"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {t(announcement.priority.toLowerCase())}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}