
import type { Employee } from '../../../../../../api/Types/types.types'
import EmployeeCard from '../cards/EmployeeCard'
import { Users } from 'lucide-react'
import { useLanguage } from '../../../../../../i18n/translations/LanguageContext'

type EmployeeListProps = {
    employees: Employee[] | undefined,
    isLoading: boolean
}

function EmployeeList({
    employees,
    isLoading
}: EmployeeListProps) {
    const { t } = useLanguage();

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t.adminEmployeeSearch?.allEmployees || 'All Employees'}
                        <span className="ml-2 text-sm font-normal text-gray-500">{t.adminEmployeeSearch?.loading || 'Loading...'}</span>
                    </h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-6 py-4 animate-pulse">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-5 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                            <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!employees || employees.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t.adminEmployeeSearch?.allEmployees || 'All Employees'}
                        <span className="ml-2 text-sm font-normal text-gray-500">(0)</span>
                    </h3>
                </div>
                <div className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">{t.adminEmployeeSearch?.noEmployeesFound || 'No employees found'}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t.adminEmployeeSearch?.allEmployees || 'All Employees'}
                    <span className="ml-2 text-sm font-normal text-gray-500">({employees.length})</span>
                </h3>
            </div>
            <div className="divide-y divide-gray-50">
                {employees.map((employee) => (
                    <EmployeeCard employee={employee} key={employee.id} />
                ))}
            </div>
        </div>
    )
}

export default EmployeeList