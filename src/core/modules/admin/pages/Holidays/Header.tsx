import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddForm from './forms/AddForm';

function Header({isLoading} : {isLoading: boolean}) {
    const [isOpen , setIsModalOpen] = useState(false);
  return (
    <>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Manage company holidays and official days off
                </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50" disabled={isLoading} onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Add Holiday
            </button>
        </div>

        <AddForm isOpen={isOpen} setIsModalOpen={setIsModalOpen}/>
    </>
  )
}

export default Header