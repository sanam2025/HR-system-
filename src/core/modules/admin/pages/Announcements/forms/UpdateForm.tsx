import { CalendarIcon, Edit, FileText, Tag, X, Users, AlertCircle, Clock } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast';
import Loading from '../../../../../../shared/components/Loading'
import { useUpdateAnnouncement } from '../../../hooks/Announcements/useAnnouncementsMutation'
import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";
import { useDepartments } from '../../../hooks/orginization/useOrginization';

type UpdateAnnouncementProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
    announcementData?: Announcements
}

function UpdateAnnouncementForm({ 
    isOpen, 
    setIsModalOpen, 
    announcementData,
}: UpdateAnnouncementProps) {
    const { t } = useLanguage();
    const { data: departments } = useDepartments();
    
    const {mutateAsync: updateAnnouncemet , isPending} = useUpdateAnnouncement();

    const formatDateTime = (date: Date | string | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [editData, setEditData] = useState({
        title: announcementData?.title || '',
        content: announcementData?.content || '',
        priority: announcementData?.priority || 'low' as AnnouncementsPriority,
        target_audience: announcementData?.target_audience || 'all' as AnnouncementsTargetAudience,
        starts_at: announcementData?.starts_at || '',
        expires_at: announcementData?.expires_at || '',
        department_id: announcementData?.department_id || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }))
    }

    if (!isOpen || !announcementData) return null;

    const handleEdit = async () => {
        try {
            if (!editData.title?.trim()) {
                toast.error(t.adminAnnouncements?.form?.titleRequired || 'Title is required');
                return;
            }

            if (!editData.content?.trim()) {
                toast.error(t.adminAnnouncements?.form?.contentRequired || 'Content is required');
                return;
            }

            if (!editData.starts_at) {
                toast.error(t.adminAnnouncements?.form?.startsAtRequired || 'Start date is required');
                return;
            }

            if (!editData.expires_at) {
                toast.error(t.adminAnnouncements?.form?.expiresAtRequired || 'Expiry date is required');
                return;
            }

            if (!announcementData?.id) {
                toast.error('Announcement ID not found');
                return;
            }

            if (editData.target_audience === 'department' && !editData.department_id) {
                toast.error(t.adminAnnouncements?.form?.validationError || 'The department field is required');
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
                title: editData.title.trim(),
                content: editData.content.trim(),
                priority: editData.priority,
                target_audience: editData.target_audience,
                starts_at: formatForApi(editData.starts_at),
                expires_at: formatForApi(editData.expires_at),
                department_id: editData.target_audience === 'department' ? Number(editData.department_id) : undefined
            };

            await updateAnnouncemet({id:announcementData?.id ,announcementData:formattedData});

            toast.success(t.adminAnnouncements?.form?.updateSuccess || 'Announcement updated successfully!');
            setIsModalOpen(false);

        } catch (e: any) {
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
                toast.error(e.message || t.adminAnnouncements?.form?.validationError || 'Failed to update announcement');
            }
        }
    }

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4A7C59]/10 text-[#4A7C59] p-2.5 rounded-xl">
                            <Edit className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{t.adminAnnouncements?.form?.update || 'Edit Announcement'}</h2>
                            <p className="text-sm text-gray-500">{t.adminAnnouncements?.subtitle || 'Update the announcement details'}</p>
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
                            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t.adminAnnouncements?.form?.titleLabel || 'Title'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="edit-title"
                                    name="title"
                                    value={editData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Company Annual Meeting"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1.5">
                                {t.adminAnnouncements?.form?.contentLabel || 'Content'} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                                <textarea
                                    id="edit-content"
                                    name="content"
                                    value={editData.content}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Enter the announcement content here..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white resize-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.priorityLabel || 'Priority'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AlertCircle className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        id="edit-priority"
                                        name="priority"
                                        value={editData.priority}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="low">{t.adminDashboard?.low || 'Low'}</option>
                                        <option value="medium">{t.adminDashboard?.medium || 'Medium'}</option>
                                        <option value="high">{t.adminDashboard?.high || 'High'}</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit-target_audience" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.audienceLabel || 'Target Audience'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        id="edit-target_audience"
                                        name="target_audience"
                                        value={editData.target_audience}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="all">{t.adminAnnouncements?.form?.allEmployees || 'All Employees'}</option>
                                        <option value="managers">{t.adminAnnouncements?.form?.managersOnly || 'Managers Only'}</option>
                                        <option value="department">{t.adminAnnouncements?.form?.specificDepartment || 'Specific Department'}</option>
                                    </select>
                                </div>
                            </div>

                            {editData.target_audience === 'department' && (
                                <div className="md:col-span-2">
                                    <label htmlFor="edit-department_id" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="edit-department_id"
                                            name="department_id"
                                            value={editData.department_id || ''}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none cursor-pointer"
                                            required={editData.target_audience === 'department'}
                                        >
                                            <option value="" disabled>Select Department</option>
                                            {departments?.data?.map((dept: any) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="edit-starts_at" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.view?.published || 'Starts At'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        id="edit-starts_at"
                                        name="starts_at"
                                        value={formatDateTime(editData.starts_at)}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit-expires_at" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t.adminAnnouncements?.form?.expiresAtLabel || 'Expires At'} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        id="edit-expires_at"
                                        name="expires_at"
                                        value={formatDateTime(editData.expires_at)}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A7C59] focus:border-[#4A7C59] outline-none transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
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
                            disabled={isPending}
                            onClick={handleEdit}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-[#4A7C59] hover:bg-[#3d6649] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (t.adminAnnouncements?.loading || 'Updating...') : (t.adminAnnouncements?.form?.update || 'Update Announcement')}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default UpdateAnnouncementForm