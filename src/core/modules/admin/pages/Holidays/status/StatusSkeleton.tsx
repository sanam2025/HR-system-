export const CardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1.5"></div>
            </div>
            <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
