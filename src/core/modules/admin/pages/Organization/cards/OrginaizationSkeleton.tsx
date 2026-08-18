import { Plus } from "lucide-react";
import { StatusSkeleton } from "./StatusSkeleton";
import { DepartmentSkeletonCard } from "./DepartementSkeleton";

const OrganizationSkeleton = () => {
   
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-xl w-36 h-10 animate-pulse flex items-center justify-center">
          <Plus className="w-4 h-4 text-gray-300" />
          <span className="ml-2 text-gray-300">Add Department</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[1,2,3].map((_,index) =>(
            <StatusSkeleton key={index}/>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map((_,index) =>(
            <DepartmentSkeletonCard key={index}/>
        ))}

      </div>
    </div>
  );
};

export default OrganizationSkeleton;