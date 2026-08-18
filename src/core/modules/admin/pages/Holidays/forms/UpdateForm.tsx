import { CalendarIcon, Edit, FileText, Tag, X } from 'lucide-react'
import React, { useState } from 'react'
import { useUpdateHoliday } from '../../../hooks/Holidays/useHolidaysMutation'
import toast from 'react-hot-toast';
import Loading from '../../../../../../shared/components/Loading'
import type { Holidays } from '../../../types/types'

type UpdateFormProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
    holidayData?: Holidays

}

function UpdateForm({ 
    isOpen, 
    setIsModalOpen, 
    holidayData ,
}: UpdateFormProps) {
    
    
    if (!isOpen) return null;

    const {mutateAsync: editHoliday , isPending: isLoading} = useUpdateHoliday();

    const [editData , setEditData] = useState({
        name: holidayData?.name,
        type: holidayData?.type,
        date: holidayData?.date,
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name , value} = e.target;
        setEditData(prev=>({...prev , [name]: value}))
    }

    const formatDateForInput = (date: string | Date | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') {
            if (date.includes('-')) {
                const parts = date.split('-');
                if (parts[0].length === 4) return date;
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return date;
        }
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDateForInput(holidayData?.date);

    const handleEdit = async () =>{
        try{
            if(!editData.name?.trim()){
                toast.error('Can`t add empty name')
                return;
            }

            if(!editData.type?.trim()){
                toast.error('Can`t add empty type')
                return;
            }

            if(!editData.date){
                toast.error('Can`t add empty date')
                return;
            }

            if(!holidayData?.id || !holidayData){
                toast.error('the Id not found')
                return;
            }

            const response = await editHoliday({id:holidayData?.id , updatedData:editData})
            toast.success(response.data.message);
        }
        catch (e: any) {
            console.error('Full error:', e);
            
            if (e.response) {
                const errorMessage = 
                    e.response.data?.message || 
                    e.response.data?.error || 
                    e.response.statusText ||
                    'Something went wrong';
                
                if (e.response.data?.errors) {
                    const errors = e.response.data.errors;
                    const errorMessages = Object.values(errors).flat();
                    toast.error(errorMessages[0] as string || 'Validation error');
                } else {
                    toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
                }
            } else if (e.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(e.message || 'Failed to update holiday');
            }
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                            <Edit className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Edit Holiday</h2>
                            <p className="text-sm text-gray-500">Update the holiday details</p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Holiday Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="edit-name"
                                    name="name"
                                    defaultValue={holidayData?.name}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="e.g., Eid Al-Fitr, National Day"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Holiday Type
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        id="edit-type"
                                        name="type"
                                        defaultValue={holidayData?.type}
                                        onChange={(e) => handleChange(e)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="company">Company</option>
                                        <option value="official">Official</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Holiday Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        id="edit-date"
                                        name="date"
                                        defaultValue={formattedDate}
                                        onChange={(e) => handleChange(e)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"

                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEdit()}
                        >
                            {isLoading ? <Loading size={1.2} borderWidth='2px' color='white'/> : 'Update Holiday'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateForm