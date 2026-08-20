import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Employee } from '../../../../../../api/Types/types.types'

function EmployeeCard({
    employee
}: {employee: Employee}) {
  const navigate = useNavigate()
  return (
        <div 
            key={employee.id} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/admin/employees/${employee.profile_id || employee.id}`)}
        >
            <div className="flex items-center gap-3 mb-1">
            <h4 className="font-medium text-gray-900">{employee.name || 'Unknown'}</h4>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {employee.department || 'No Department'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
                employee.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-red-700'
            }`}>
                {employee.status || 'Unknown'}
            </span>
            </div>
            <p className="text-sm text-gray-500">{employee.job_title || 'No Position'}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {employee.email || 'No Email'}
            </span>
            </div>
        </div>
  )
}

export default EmployeeCard