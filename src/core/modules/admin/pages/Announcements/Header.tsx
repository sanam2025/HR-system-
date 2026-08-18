import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddAnnouncementForm from './forms/AddForm'

function Header() {

  const [isOpen , setIsOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
              <p className="text-gray-500 mt-1 text-sm">
              Create and manage company announcements
              </p>
          </div>
          <button type='button' className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2" onClick={() => setIsOpen(true)}>
              <Plus className="w-4 h-4" />
              New Announcement
          </button>
      </div>

      <AddAnnouncementForm isOpen={isOpen} setIsModalOpen={setIsOpen}/>
    </>
  )
}

export default Header