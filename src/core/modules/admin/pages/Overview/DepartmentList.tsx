import { Users } from 'lucide-react'
import type { Department } from '../../types/types'


type DepartmentListProps = {
    departmentData: Department[] | undefined
}

function DepartmentList({
    departmentData
}: DepartmentListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Department Overview</h3>
        <Users className="w-5 h-5 text-gray-400" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {departmentData?.map((dept) => (
        <div
            key={dept.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
            <div>
            <p className="font-medium text-gray-800">{dept.name}</p>
            <p className="text-xs text-gray-400">
                Created: {new Date(dept.created_at).toLocaleDateString()}
            </p>
            </div>
            <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
                {dept.users_count}
            </span>
            <span className="text-xs text-gray-400">employees</span>
            </div>
        </div>
        ))}
    </div>
    </div>
  )
}

export default DepartmentList