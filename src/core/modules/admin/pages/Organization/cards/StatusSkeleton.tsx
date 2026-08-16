export const StatusSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="bg-gray-200 p-3 rounded-xl">
          <div className="w-5 h-5"></div>
        </div>
      </div>
    </div>
  );
