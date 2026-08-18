
import type { Announcements } from '../../../types/types';
import AnnouncementsCards from './AnnouncementsCards';
import { AnnouncementsSkeleton } from './AnnouncementsSkeleton';

type AnnouncementProps = {
    announcements: Announcements[] | undefined;
    isLoading?: boolean;
    error?: Error | null;
    refetch: () => void;
}

function AnnouncementsList({
    announcements,
    isLoading,
    error,
    refetch
}:AnnouncementProps) {

  if(isLoading){
    return <AnnouncementsSkeleton/>
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-3 text-red-700 hover:text-red-800 underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">All Announcements</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {announcements?.map((announcement) => (
            <AnnouncementsCards key={announcement.id} announcement={announcement}/>
          ))}
        </div>
    </div>
  )
}

export default AnnouncementsList