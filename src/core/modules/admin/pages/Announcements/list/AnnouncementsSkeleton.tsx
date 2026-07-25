export const AnnouncementsSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="px-6 py-5">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                
                                <div className="space-y-1.5 mb-2">
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-4">
                                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};