import { Building, Users, UserCog } from 'lucide-react'

import type { Department } from '../../../types/types';
import { useUsersCount } from '../../../hooks/orginization/useOrginization';
import { StatusSkeleton } from '../cards/StatusSkeleton';


type StatusCardProps = {
    departments: Department[] | undefined;
}


function StatusCard({
    departments,
}: StatusCardProps) {

    const {data: counts , isLoading} = useUsersCount();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {[1,2,3].map((_,index) =>(
                    <StatusSkeleton key={index}/>
                ))}
            </div>
        );
    }

    const statusCard = [
        {title: 'Total Departments' , value: departments?.length , valueColor: 'text-gray-900' , icon: <Building className="w-5 h-5" /> , iconColor:'text-indigo-600' , iconBgColor: 'bg-indigo-50'},
        {title: 'Total Employees' , value: counts?.data.employees_count , valueColor: 'text-emerald-600' , icon: <Users className="w-5 h-5" /> , iconColor:'text-emerald-600' , iconBgColor: 'bg-emerald-50'},
        {title: 'Department Managers' , value: counts?.data.managers_count , valueColor: 'text-orange-600' , icon: <UserCog className="w-5 h-5" /> , iconColor:'text-orange-600' , iconBgColor: 'bg-orange-50'},
    ]


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statusCard.map((item) =>(
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <p className={`text-2xl font-bold ${item.valueColor}`}>{item.value}</p>
                    </div>
                    <div className={`${item.iconBgColor} ${item.iconColor} p-3 rounded-xl`}>
                        {item.icon}
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default StatusCard