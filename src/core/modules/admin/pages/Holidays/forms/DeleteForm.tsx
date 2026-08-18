import { Trash2} from 'lucide-react'
import Loading from '../../../../../../shared/components/Loading'
import { useDeleteHolidays } from '../../../hooks/Holidays/useHolidaysMutation'
import type { Holidays } from '../../../types/types'
import toast from 'react-hot-toast';


type DeleteFormProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
    holiday?: Holidays
}

function DeleteForm({ 
    isOpen, 
    setIsModalOpen, 
    holiday,
}: DeleteFormProps) {

    const {mutateAsync:deleteHoliday , isPending: isLoading} = useDeleteHolidays();
    
    if (!isOpen) return null;

    const handleDelete = async () => {

        try{
            if(holiday && holiday.id){
                const  response = await deleteHoliday(holiday?.id)
                toast.success(response.data);
                setIsModalOpen(false);
            }
        }
        catch(e: any){
            toast.error(e as string);
            if(e.response){
                toast.error(e.response as string);
            }
            console.error(e)
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4'>
                <div className='flex items-start gap-3 mb-4'>
                    <div className='bg-red-100 rounded-full p-2'>
                        <Trash2 className='text-red-600 text-xl' />
                    </div>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Delete Holiday
                        </h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete "{holiday?.name}"? This action cannot be undone.
                        </p>
                    </div>
                </div>
                
                <div className='flex justify-end gap-3'>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                        {isLoading ? <Loading size={1.2} borderWidth='2px' color='white'/> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteForm