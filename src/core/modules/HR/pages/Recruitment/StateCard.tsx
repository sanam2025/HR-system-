import React from 'react'
import type { JobRequisition } from '../../../../../api/service/HrService/Types/HRService.types';

function StateCard({data} : {data: JobRequisition[] | undefined }) {

    const stats = {
        total: data?.length,
        approved: data?.filter((r) => r.status === "approved").length,
        pending: data?.filter((r) => r.status === "pending" || r.status === null).length,
        rejected: data?.filter((r) => r.status === "rejected").length,
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Approved</p>
        <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
        <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Rejected</p>
        <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
    </div>
    </div>
  )
}

export default StateCard