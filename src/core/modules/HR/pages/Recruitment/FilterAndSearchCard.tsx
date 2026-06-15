import { RefreshCw, Search, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { FilterStatus } from './Recruitment'



type FilterAndSearchCardProps = {
    // searchTerm: string
    // setSearchTerm: (value: string) => void
    statusFilter: FilterStatus

    setStatusFilter: (value: FilterStatus) => void
    refetch: () => void
}

function FilterAndSearchCard({
    statusFilter,
    
    setStatusFilter,
    refetch
} : FilterAndSearchCardProps) {
    const navigate = useNavigate();


    

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by job title..."
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white min-w-[130px] focus:ring-2 focus:ring-blue-500 outline-none"
                >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                </select>
                <button
                onClick={() => navigate("/Hr/all-applicants")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
                <Users className="w-4 h-4" /> All Applicants
                </button>
                <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700">
                <RefreshCw className="w-4 h-4" /> Refresh
            </button>
        </div>
    </div>
  )
}

export default FilterAndSearchCard