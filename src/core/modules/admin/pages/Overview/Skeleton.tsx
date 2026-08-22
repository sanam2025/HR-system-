import React from "react";export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    ))}
  </div>
);export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-40"></div>
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
    <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-gray-200"></div>
    </div>
  </div>
);export const DepartmentListSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-40"></div>
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
      ))}
    </div>
  </div>
);export const PayrollTableSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div className="h-6 bg-gray-200 rounded w-40"></div>
      <div className="h-10 bg-gray-200 rounded-xl w-48"></div>
    </div>
    <div className="space-y-3">      <div className="flex gap-4">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
      </div>      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      ))}
    </div>
  </div>
);export const HeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
    </div>
  </div>
);const ReportsSkeleton = () => (
  <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
    <HeaderSkeleton />
    <StatsSkeleton />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
    <DepartmentListSkeleton />
    <PayrollTableSkeleton />
  </div>
);

export default ReportsSkeleton;