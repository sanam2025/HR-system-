// core/modules/HR/pages/Terminations.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import TerminationRequestRow from "../Components/Special_Components/TerminationRequestRow";
import TerminationFormModal from "../Components/Special_Components/TerminationFormModal";
import type { TerminationRequest } from "../types/termination.types";

// ============= Data (Static) =============
const terminationRequests: TerminationRequest[] = [
  {
    id: "1",
    employeeName: "Ahmed Mansour",
    employeeId: "EMP001",
    department: "Information Technology",
    position: "Web Developer",
    terminationType: "termination",
    effectiveDate: "2026-06-15",
    reason: "Performance issues",
    status: "submitted",
    submittedDate: "2026-06-07",
  },
  {
    id: "2",
    employeeName: "Sara Khalil",
    employeeId: "EMP002",
    department: "Basic Sciences",
    position: "Professor",
    terminationType: "contractEnd",
    effectiveDate: "2026-06-30",
    reason: "Contract completion",
    status: "draft",
    submittedDate: "2026-06-05",
  },
];

export default function Terminations() {
  const [requests, setRequests] = useState<TerminationRequest[]>(terminationRequests);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleView = (request: TerminationRequest) => {
    alert(`📋 ${request.employeeName}\nType: ${request.terminationType}\nReason: ${request.reason}\nEffective Date: ${request.effectiveDate}`);
  };

  const handleProcess = (request: TerminationRequest) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: "processed" } : r
    ));
    alert(`✅ ${request.employeeName}'s termination has been processed. All documents and compensation are ready.`);
  };

  const handleSubmitTermination = (data: Partial<TerminationRequest>) => {
    const newRequest: TerminationRequest = {
      id: String(Date.now()),
      employeeName: data.employeeName || "",
      employeeId: data.employeeId || "",
      department: data.department || "",
      position: data.position || "",
      terminationType: data.terminationType || "termination",
      effectiveDate: data.effectiveDate || "",
      reason: data.reason || "",
      status: "submitted",
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newRequest, ...prev]);
    alert(`✅ Termination request for ${newRequest.employeeName} has been submitted successfully!`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Termination</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage employee termination, contract end, and compensation.</p>
          </div>
          <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
            <Plus className="w-4 h-4" /> New Termination Request
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{requests.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{requests.filter(r => r.status === "submitted").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Processed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{requests.filter(r => r.status === "processed").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Draft</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{requests.filter(r => r.status === "draft").length}</p>
        </div>
      </div>

      {/* Termination Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Effective Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((request) => (
                <TerminationRequestRow key={request.id} request={request} onView={handleView} onProcess={handleProcess} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Termination Form Modal */}
      <TerminationFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmitTermination} />
    </div>
  );
}