import { Calendar, Clock, Users, User, FileText, X} from 'lucide-react'
import type { Announcements } from '../../../types/types'
import { createPortal } from 'react-dom'
import { formatDate, formatTime, getPriorityStyles, getStatusStyles, getTargetAudienceLabel } from '../../../util/utils'
import { useLanguage } from "../../../../../../i18n/translations/LanguageContext";

type AnnouncementsShowProps = {
    isOpen: boolean
    setIsModalOpen: (value: boolean) => void
    announcement?: Announcements
}

function AnnouncementsShow({ 
    isOpen, 
    setIsModalOpen, 
    announcement 
}: AnnouncementsShowProps) {
    const { t, lang } = useLanguage();
    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#4A7C59]/10 to-[#4A7C59]/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-[#4A7C59] to-[#3d6649] text-white p-2.5 rounded-xl shadow-lg shadow-[#4A7C59]/20">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{announcement?.title}</h2>
                            <p className="text-sm text-gray-500">{t.adminAnnouncements?.view?.details || 'Announcement Details'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-sm px-3 py-1.5 rounded-full font-medium border ${getPriorityStyles(announcement?.priority as string)}`}>
                                {t.adminAnnouncements?.form?.priorityLabel || 'Priority'}: {t.adminDashboard?.[announcement?.priority?.toLowerCase() as keyof typeof t.adminDashboard] || announcement?.priority}
                            </span>
                            <span className={`text-sm px-3 py-1.5 rounded-full font-medium border ${getStatusStyles(announcement?.status as string)}`}>
                                {t.adminAnnouncements?.table?.status || 'Status'}: {t.adminAnnouncements?.stats?.[announcement?.status?.toLowerCase() as keyof typeof t.adminAnnouncements.stats] || announcement?.status}
                            </span>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">{t.adminAnnouncements?.form?.contentLabel || 'Content'}</h4>
                            <div className="bg-gradient-to-br from-gray-50 to-[#4A7C59]/5 rounded-xl p-4 border border-gray-100">
                                <p className="text-gray-800 whitespace-pre-wrap">{announcement?.content}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#4A7C59]/10 to-[#4A7C59]/5 rounded-lg border border-[#4A7C59]/20">
                                    <Calendar className="w-4 h-4 text-[#4A7C59]" />
                                    <div>
                                        <p className="text-xs text-gray-500">{t.adminAnnouncements?.view?.published || 'Starts At'}</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(announcement?.starts_at as Date)}</p>
                                        <p className="text-xs text-[#4A7C59]">{formatTime(announcement?.starts_at as Date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">{t.adminAnnouncements?.form?.expiresAtLabel || 'Expires At'}</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(announcement?.expires_at as Date)}</p>
                                        <p className="text-xs text-amber-600">{formatTime(announcement?.expires_at as Date)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                    <Users className="w-4 h-4 text-purple-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">{t.adminAnnouncements?.form?.audienceLabel || 'Target Audience'}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {getTargetAudienceLabel(announcement?.target_audience as string)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                    <User className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-500">{t.adminAnnouncements?.view?.author || 'Author'}</p>
                                        <p className="text-sm font-medium text-gray-900">{announcement?.author.full_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>{t.adminAnnouncements?.view?.created || 'Created'}: {formatDate(announcement?.created_at as Date)} {t.adminAnnouncements?.view?.at || 'at'} {formatTime(announcement?.created_at as Date)}</span>
                                <span>{t.adminAnnouncements?.view?.updated || 'Updated'}: {formatDate(announcement?.updated_at as Date)} {t.adminAnnouncements?.view?.at || 'at'} {formatTime(announcement?.updated_at as Date)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                        >
                            {t.adminAnnouncements?.form?.cancel || 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AnnouncementsShow;