

import { 
  Plus, 
  Database,
  RefreshCw
} from "lucide-react";

import StatusCard from "./status/StatusCard";
import DepartementCard from "./cards/DepartementCard";
import { useDepartments } from "../../hooks/orginization/useOrginization";
import OrganizationSkeleton from "./cards/OrginaizationSkeleton";

export default function Organization() {

  const {data: departments , isLoading , refetch} = useDepartments();

  if(isLoading){
    return <OrganizationSkeleton/>
  }

  if (!departments || departments?.data?.length === 0) {
      return (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 text-center mb-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="bg-gray-50 p-4 rounded-full">
                      <Database className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-gray-900">No Departments Found</h3>
                      <p className="text-sm text-gray-500 mt-1">No departments have been created yet.</p>
                  </div>
                  <button 
                      onClick={() => refetch()}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Structure</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage departments and organizational hierarchy
          </p>
        </div>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </button> */}
      </div>

      <StatusCard departments={departments?.data}/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments?.data?.map((dept, index) => (
          <DepartementCard key={dept.id || index} department={dept}/>
        ))}
      </div>
    </div>
  );
}