import { Briefcase } from 'lucide-react'
import type { Department } from '../../../types/types'


type DepartementCardProps = {
    department: Department;


}

function DepartementCard({
    department
}: DepartementCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{department.name}</h3>
                </div>            </div>
        </div>
        <div className="px-6 py-4">
            <div className="flex items-center gap-4 mb-3">
                
                
            </div>

            
        </div>
    </div>
  )
}

export default DepartementCard