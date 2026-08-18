import { CalendarIcon, FileText, Plus, Tag, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useCreateHolidays } from '../../../hooks/Holidays/useHolidaysMutation'
import type { HolidaysType } from '../../../types/types'

type AddFromProps = {
    isOpen: boolean , 
    setIsModalOpen:(value: boolean) => void
}

function AddForm({isOpen , setIsModalOpen} : AddFromProps) {

    const {mutateAsync: create , isPending} = useCreateHolidays();

    const [data , setData] = useState({
        name: '',
        type: 'company' as HolidaysType,
        date: '',
    })

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name , value} = e.target;
        setData(prev=>({...prev , [name]: value}))
    }

    const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) =>{
        try{
            e.preventDefault();

            if (!data.name.trim()) {
                toast.error('The name field is required');
                return;
            }

            if (!data.date.trim()) {
                toast.error('The date field is required');
                return;
            }
            const dateParts = data.date.split('-');
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; 

            const submitData = {
                name: data.name,
                type: data.type,
                date: formattedDate,
            };

            const response = await create(submitData);
            toast.success(response.data.message);
            setIsModalOpen(false);

        }catch(e: any){
            toast.error(e as string);
            if(e.response){
                toast.error(e.response as string);
            }
            console.error(e)
        }
        

    }

  return (
    <>
    {isOpen &&
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
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add New Holiday</h2>
                        <p className="text-sm text-gray-500">Fill in the details to add a new holiday</p>
                    </div>
                    </div>
                    <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                    <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="px-6 py-6" onSubmit={(e) => handleSubmit(e)}>
                    <div className="space-y-5">
                        
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Holiday Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={(e) => handleChange(e)}
                            placeholder="e.g., Eid Al-Fitr, National Day"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                            required
                        />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Holiday Type <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                id="type"
                                name="type"
                                onChange={(e) => handleChange(e)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                required
                            >
                                <option value="company">Company</option>
                                <option value="official">Official</option>

                            </select>
                        </div>
                        
                        </div>

                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Holiday Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            onChange={(e) => handleChange(e)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                            required
                        />
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
                        className="px-6 py-2.5 text-sm font-medium disabled:opacity-50 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                        disabled={isPending}
                    >
                        <Plus className="w-4 h-4" />
                        {isPending? 'Saving...' : 'Save Holiday' }
                    </button>
                    </div>
                </form>
            </div>
        </div>
        
    }
    </>
  )
}

export default AddForm