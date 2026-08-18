import { Trash2 } from 'lucide-react'
import Loading from '../../../../../../shared/components/Loading'
import type { Announcements } from '../../../types/types'
import toast from 'react-hot-toast';
import { useDeleteAnnouncement } from '../../../hooks/Announcements/useAnnouncementsMutation'

type DeleteFormProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
    announcement?: Announcements
}

function DeleteForm({ 
    isOpen, 
    setIsModalOpen, 
    announcement,
}: DeleteFormProps) {

    const { mutateAsync: deleteAnnouncement, isPending: isLoading } = useDeleteAnnouncement();
    
    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            if (announcement && announcement.id) {
                const response = await deleteAnnouncement(announcement.id);
                toast.success(response?.data?.message || 'Announcement deleted successfully!');
                setIsModalOpen(false);
            }
        } catch (e: any) {
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
                    toast.error(errorMessage);
                }
            } else if (e.request) {
                toast.error('No response from server. Please check your connection.');
            } else {
                toast.error(e.message || 'Failed to delete announcement');
            }
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
                            Delete Announcement
                        </h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete "{announcement?.title}"? This action cannot be undone.
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