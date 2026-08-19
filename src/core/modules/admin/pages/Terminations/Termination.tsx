
import { useState } from "react";
import { 
  UserX, 
  Search,
  Filter,

} from "lucide-react";
import { useTerminations } from "../../hooks/Terminations/useTerminations";
import { StatsCards } from "./card/StatusCard";
import { TerminationCard } from "./card/TerminationsCard";
import Skeleton from "./Skeleton";

export default function Terminations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: terminations, isLoading: isLoadingTerminations } = useTerminations();

  const data = terminations?.data || [];

  const filteredData = data.filter((t: any) => {
    const matchesSearch = t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["all", "pending", "approved", "rejected", "cancelled"];

  if (isLoadingTerminations) {
    return <Skeleton/>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terminations</h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Manage employee terminations and approval workflows
          </p>
        </div>
      </div>

      <StatsCards data={data} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-50 rounded-full p-6">
              <UserX className="w-12 h-12 text-gray-300" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Terminations Found</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm || filterStatus !== "all" 
              ? "No terminations match your current filters" 
              : "No employee terminations have been initiated yet"}
          </p>
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map((termination: any) => (
            <TerminationCard key={termination.id} termination={termination} />
          ))}
        </div>
      )}
    </div>
  );
}