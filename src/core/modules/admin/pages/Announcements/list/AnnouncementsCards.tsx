import { Calendar, Edit, Trash2, Users, Clock, Eye, CheckCircle } from 'lucide-react'
import type { Announcements } from '../../../types/types'
import { useState } from 'react';
import AnnouncementsShow from './AnnouncemetsShowPage';
import { formatDate, getPriorityStyles, getStatusStyles, getTargetAudienceLabel } from '../../../util/utils';
import UpdateAnnouncementForm from '../forms/UpdateForm';
import DeleteForm from '../forms/DeleteForm';
import toast from 'react-hot-toast';
import Loading from '../../../../../../shared/components/Loading';
import { usePublishAnnouncemet } from '../../../hooks/Announcements/useAnnouncementsMutation';

function AnnouncementsCards({ announcement }: { announcement: Announcements }) {

    const [isOpen, setisOpen] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const {mutateAsync: publishAnnouncemet , isPending} = usePublishAnnouncemet();

    const handlePublish = async () => {
        try {
            await publishAnnouncemet(announcement?.id);
            console.log('Publishing announcement:', announcement.id);
            toast.success('Announcement published successfully!');
        } catch (e: any) {
            console.error('Error publishing announcement:', e);
            if (e.response) {
                toast.error(e.response.data?.message || 'Failed to publish announcement');
            } else {
                toast.error('Failed to publish announcement');
            }
        }
    };

    const isActive = announcement.status === 'active';

    return (
        <>
        <div className="px-6 py-5 hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {announcement.title}
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getPriorityStyles(announcement.priority)}`}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyles(announcement.status)}`}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                            {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {announcement.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(announcement.starts_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {getTargetAudienceLabel(announcement.target_audience)}
                        </span>
                        {announcement.expires_at && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Expires: {formatDate(announcement.expires_at)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 ml-4">
                    {!isActive && (
                        <button 
                            className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                            title="Publish announcement"
                            onClick={handlePublish}
                            disabled={isPending}
                        >
                            {isPending ? <Loading size={1} borderWidth='2px' color='#10b981'/> : <CheckCircle className="w-4 h-4" />}
                        </button>
                    )}

                    <button 
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View details"
                        onClick={() => setisOpen(true)}
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200"
                        title="Edit announcement"
                        onClick={() => setIsOpenEdit(true)}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete announcement"
                        onClick={() => setIsOpenDelete(true)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <AnnouncementsShow isOpen={isOpen} setIsModalOpen={setisOpen} announcement={announcement}/>
        <UpdateAnnouncementForm isOpen={isOpenEdit} setIsModalOpen={setIsOpenEdit} announcementData={announcement}/>
        <DeleteForm isOpen={isOpenDelete} setIsModalOpen={setIsOpenDelete} announcement={announcement}/>
        </>
    );
}

export default AnnouncementsCards;