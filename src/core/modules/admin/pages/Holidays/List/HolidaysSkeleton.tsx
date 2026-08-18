
function HolidaysSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse mt-1.5"></div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="px-6 py-5">
            <div className="flex items-start justify-between">

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse ml-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default HolidaysSkeleton