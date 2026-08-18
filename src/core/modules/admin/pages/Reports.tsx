// core/modules/Admin/pages/Reports.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Download,
  PieChart,
  LineChart,
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
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

export default function Reports() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const reports = [
    { title: t('attendanceReport'), value: "92%", change: "+3%", color: "emerald", icon: TrendingUp },
    { title: t('employeeTurnover'), value: "8%", change: "-2%", color: "blue", icon: Users },
    { title: t('payrollSummary'), value: t('sar485k'), change: "+5%", color: "purple", icon: DollarSign },
    { title: t('leaveUsage'), value: t('days156'), change: "+12%", color: "orange", icon: Calendar },
  ];

  // Chart Data
  const attendanceTrendData = [
    { week: t('week1'), rate: 88, target: 90 },
    { week: t('week2'), rate: 92, target: 90 },
    { week: t('week3'), rate: 85, target: 90 },
    { week: t('week4'), rate: 95, target: 90 },
    { week: t('week5'), rate: 89, target: 90 },
  ];

  const departmentDistributionData = [
    { name: t('itDept'), value: 35, color: "#3b82f6" },
    { name: t('salesDept'), value: 28, color: "#f59e0b" },
    { name: t('financeDept'), value: 22, color: "#8b5cf6" },
    { name: t('hrDept'), value: 15, color: "#10b981" },
  ];

  const monthlyPayrollData = [
    { month: t('jan'), amount: 420000, bonus: 25000 },
    { month: t('feb'), amount: 435000, bonus: 28000 },
    { month: t('mar'), amount: 450000, bonus: 32000 },
    { month: t('apr'), amount: 460000, bonus: 30000 },
    { month: t('may'), amount: 475000, bonus: 35000 },
    { month: t('jun'), amount: 485000, bonus: 38000 },
  ];

  const leaveUsageData = [
    { department: t('itDept'), annual: 12, sick: 4, personal: 3 },
    { department: t('salesDept'), annual: 15, sick: 6, personal: 5 },
    { department: t('financeDept'), annual: 10, sick: 3, personal: 2 },
    { department: t('hrDept'), annual: 14, sick: 5, personal: 4 },
    { department: t('operationsDept'), annual: 11, sick: 4, personal: 3 },
  ];

  const employeeSatisfactionData = [
    { department: t('itDept'), satisfaction: 4.2 },
    { department: t('salesDept'), satisfaction: 3.8 },
    { department: t('financeDept'), satisfaction: 4.5 },
    { department: t('hrDept'), satisfaction: 4.7 },
    { department: t('operationsDept'), satisfaction: 3.9 },
  ];

  const applicantPipelineData = [
    { stage: t('applications'), count: 156, color: "#3b82f6" },
    { stage: t('interviews'), count: 89, color: "#8b5cf6" },
    { stage: t('jobOffers'), count: 34, color: "#f59e0b" },
    { stage: t('hired'), count: 12, color: "#10b981" },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reportsAnalytics')}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {t('viewExportAnalytics')}
          </p>
        </div>
        <button className="bg-green text-white px-4 py-2 rounded-xl hover:bg-green-dark transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('exportAll')}
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {reports.map((report, idx) => {
          const Icon = report.icon;
          const colorClasses = {
            emerald: "bg-emerald-50 text-emerald-600",
            blue: "bg-blue-50 text-blue-600",
            purple: "bg-purple-50 text-purple-600",
            orange: "bg-orange-50 text-orange-600",
          };
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className={`${colorClasses[report.color as keyof typeof colorClasses]} p-3 rounded-xl`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${report.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {report.change}
                </span>
              </div>
              <h3 className="text-sm text-gray-500">{report.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{report.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Trend - Line Chart with Target */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('attendanceTrendTarget')}</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                name={t('rate')}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name={t('target')}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#94a3b8", r: 4 }}
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>

        {/* {t('departmentDistribution')} - Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('departmentDistribution')}</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={departmentDistributionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name} (${value}%)`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Payroll Summary - Composed Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('payrollBonusTrends')}</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyPayrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#3b82f6" name={t('amount')} radius={[8, 8, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bonus"
                name={t('bonus')}
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Usage - Stacked Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('leaveUsageByDept')}</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ReBarChart data={leaveUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="annual" stackId="a" fill="#3b82f6" name={t('annual')} />
              <Bar dataKey="sick" stackId="a" fill="#ef4444" name={t('sick')} />
              <Bar dataKey="personal" stackId="a" fill="#f59e0b" name={t('personal')} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Section - Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* {t('employeeSatisfaction')} - Area Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('employeeSatisfaction')}</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={employeeSatisfactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="satisfaction"
                name={t('satisfaction')}
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* {t('applicantPipeline')} - Scatter Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">{t('applicantPipeline')}</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {applicantPipelineData.map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                <p className="text-sm text-gray-500 mt-1">{item.stage}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div 
                    className="h-1 rounded-full" 
                    style={{ 
                      width: `${(item.count / 156) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="category" dataKey="stage" name={t('stage')} />
              <YAxis type="number" dataKey="count" name={t('count')} />
              <ZAxis type="number" range={[100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={applicantPipelineData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Width Chart - {t('deptPerformanceComparison')} */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">{t('deptPerformanceComparison')}</h3>
          <BarChart className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <ReBarChart data={[
            { department: t('itDept'), performance: 92, satisfaction: 4.2 },
            { department: t('salesDept'), performance: 85, satisfaction: 3.8 },
            { department: t('financeDept'), performance: 88, satisfaction: 4.5 },
            { department: t('hrDept'), performance: 90, satisfaction: 4.7 },
            { department: t('operationsDept'), performance: 78, satisfaction: 3.9 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="performance" fill="#3b82f6" name={t('performance')} radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="satisfaction" fill="#8b5cf6" name={t('satisfaction')} radius={[8, 8, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}