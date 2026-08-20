import { Users, Building, User, Loader2 } from 'lucide-react'
import { useDepartmentsCount } from '../../../hooks/orginization/useOrginization'
import type { Employee } from '../../../../../../api/Types/types.types';
import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";


type StatsCardsProps = {
    employees: Employee[] | undefined;
}

function StatsCards({
    employees
}: StatsCardsProps) {
    const { t } = useLanguage();
    const { data: counts, isLoading } = useDepartmentsCount();

    const totalEmployees = employees?.length || 0;
    const totalActiveEmployees = employees?.filter(emp => emp.status === 'active').length || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{t.adminEmployeeSearch?.totalEmployees || 'Total Employees'}</p>
                        <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                        <Users className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{t.adminEmployeeSearch?.departments || 'Departments'}</p>
                        {isLoading ? (
                            <div className="flex items-center gap-2 mt-1">
                                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                <span className="text-sm text-gray-400">Loading...</span>
                            </div>
                        ) : (
                            <p className="text-2xl font-bold text-emerald-600">{counts?.data.departments_count || 0}</p>
                        )}
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                        <Building className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">{t.adminEmployeeSearch?.activeEmployees || 'Active Employees'}</p>
                        <p className="text-2xl font-bold text-indigo-600">{totalActiveEmployees}</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCards