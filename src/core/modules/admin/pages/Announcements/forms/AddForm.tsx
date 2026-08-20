import { CalendarIcon, FileText, Plus, Tag, X, Users, AlertCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useCreateAnnouncemet } from '../../../hooks/Announcements/useAnnouncementsMutation'
import type { CreateAnnouncemetPayload } from '../../../types/types'
import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";

type AddAnnouncementProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
}

function AddAnnouncementForm({ isOpen, setIsModalOpen }: AddAnnouncementProps) {
    const { t } = useLanguage();
    const [data, setData] = useState<CreateAnnouncemetPayload>({
        title: '',
        content: '',
        priority: 'low',
        target_audience: 'all',
        starts_at: '',
        expires_at: '',
    })

    const {mutateAsync: AddAnnouncement , isPending:isLoading} = useCreateAnnouncemet();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            if(!data.title.trim()){
                toast.error(t.adminAnnouncements?.form?.titleRequired || 'The title field is required');
                return;
            }
    
            if(!data.content.trim()){
                toast.error(t.adminAnnouncements?.form?.contentRequired || 'The content field is required');
                return;
            }
    
            if(!data.starts_at.trim()){
                toast.error(t.adminAnnouncements?.form?.startsAtRequired || 'The starts at field is required');
                return;
            }
    
            if(!data.expires_at.trim()){
                toast.error(t.adminAnnouncements?.form?.expiresAtRequired || 'The expires at field is required');
                return;
            }
    
            const formatForApi = (dateString: string) => {
                if (!dateString) return '';
                if (dateString.includes('T')) {
                    const withSeconds = dateString.length === 16 ? `${dateString}:00` : dateString;
                    return withSeconds.replace('T', ' ');
                }
                return dateString;
            };

            const formattedData = {
                ...data,
                starts_at: formatForApi(data.starts_at),
                expires_at: formatForApi(data.expires_at),
            };

            await AddAnnouncement(formattedData);
            toast.success(t.adminAnnouncements?.form?.addSuccess || 'Announcement Added successfully');
            setIsModalOpen(false);
        }catch (e: any) {
            console.error('Full error:', e);
            
            if (e.response) {
                const errorMessage = 
                    e.response.data?.message || 
                    e.response.data?.error || 
                    e.response.statusText ||
                    t.adminAnnouncements?.form?.validationError ||
                    'Something went wrong';
                
                if (e.response.data?.errors) {
                    const errors = e.response.data.errors;
                    const errorMessages = Object.values(errors).flat();
                    toast.error(errorMessages[0] as string || t.adminAnnouncements?.form?.validationError || 'Validation error');
                } else {
                    toast.error(errorMessage);
                }
            } else if (e.request) {
                toast.error(t.adminAnnouncements?.form?.noResponse || 'No response from server. Please check your connection.');
            } else {
                toast.error(e.message || t.adminAnnouncements?.form?.validationError || 'Failed to update holiday');
            }
        }
    }



    if (!isOpen) return null;

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
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{t.adminAnnouncements?.newAnnouncement || 'Add New Announcement'}</h2>
                            <p className="text-sm text-gray-500">{t.adminAnnouncements?.subtitle || 'Fill in the details to create a new announcement'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form className="px-6 py-6" onSubmit={(e) =>handleSubmit(e)}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t.adminAnnouncements?.form?.titleLabel || 'Title'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Company Annual Meeting"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t.adminAnnouncements?.form?.contentLabel || 'Content'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter the announcement content here..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white resize-none"
                                    required
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.priorityLabel || 'Priority'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={data.priority}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="low">{t.adminDashboard?.low || 'Low'}</option>
                                        <option value="medium">{t.adminDashboard?.medium || 'Medium'}</option>
                                        <option value="high">{t.adminDashboard?.high || 'High'}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.audienceLabel || 'Target Audience'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        id="target_audience"
                                        name="target_audience"
                                        value={data.target_audience}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="all">{t.adminAnnouncements?.form?.allEmployees || 'All Employees'}</option>
                                        <option value="managers">{t.adminAnnouncements?.form?.managersOnly || 'Managers Only'}</option>
                                        <option value="department">{t.adminAnnouncements?.form?.specificDepartment || 'Specific Department'}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="starts_at" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.view?.published || 'Starts At'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        id="starts_at"
                                        name="starts_at"
                                        value={data.starts_at}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.expiresAtLabel || 'Expires At'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        id="expires_at"
                                        name="expires_at"
                                        value={data.expires_at}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                        required
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
                            {t.adminAnnouncements?.form?.cancel || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <Plus className="w-4 h-4" />
                            {isLoading? (t.adminAnnouncements?.loading || 'Publishing...') : (t.adminAnnouncements?.form?.submit || 'Publish Announcement')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddAnnouncementForm