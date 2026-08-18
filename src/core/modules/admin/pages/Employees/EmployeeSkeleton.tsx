import React from 'react'

function EmployeeSkeleton() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="bg-gray-200 p-3 rounded-xl">
                  <div className="w-5 h-5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default EmployeeSkeleton