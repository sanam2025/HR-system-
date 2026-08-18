
export const DashboardSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 h-[300px]">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="flex items-center justify-center h-[200px]">
              <div className="w-32 h-32 rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 h-[300px]">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};