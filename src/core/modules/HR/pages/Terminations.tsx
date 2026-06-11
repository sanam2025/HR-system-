// core/modules/HR/pages/Terminations.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";
import TerminationRequestRow from "../Components/Special_Components/TerminationRequestRow";
import TerminationFormModal from "../Components/Special_Components/TerminationFormModal";
import type { TerminationRequest } from "../types/termination.types";

// ============= DATA =============
const INITIAL_TERMINATIONS: TerminationRequest[] = [
  { id: "1", employeeName: "Ahmed Mansour", employeeId: "EMP001", department: "Information Technology", position: "Web Developer", terminationType: "termination", effectiveDate: "2026-06-15", reason: "Performance issues", status: "submitted", submittedDate: "2026-06-07" },
  { id: "2", employeeName: "Sara Khalil", employeeId: "EMP002", department: "Basic Sciences", position: "Professor", terminationType: "contractEnd", effectiveDate: "2026-06-30", reason: "Contract completion", status: "draft", submittedDate: "2026-06-05" },
];

const STATS_CONFIG = [
  { key: "total", label: "Total Requests", color: "text-gray-800", getValue: (arr: TerminationRequest[]) => arr.length },
  { key: "pending", label: "Pending", color: "text-amber-600", getValue: (arr: TerminationRequest[]) => arr.filter(r => r.status === "submitted").length },
  { key: "processed", label: "Processed", color: "text-emerald-600", getValue: (arr: TerminationRequest[]) => arr.filter(r => r.status === "processed").length },
  { key: "draft", label: "Draft", color: "text-gray-600", getValue: (arr: TerminationRequest[]) => arr.filter(r => r.status === "draft").length },
];

const COLUMNS = ["Employee", "Department", "Type", "Effective Date", "Status", "Actions"];

// ============= STATS GRID =============
const StatsGrid = ({ requests }: { requests: TerminationRequest[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {STATS_CONFIG.map(({ label, color, getValue }) => (
      <div key={label} className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{getValue(requests)}</p>
      </div>
    ))}
  </div>
);

// ============= MAIN =============
export default function Terminations() {
  const [requests, setRequests] = useState<TerminationRequest[]>(INITIAL_TERMINATIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleView = (r: TerminationRequest) => alert(`📋 ${r.employeeName}\nType: ${r.terminationType}\nReason: ${r.reason}\nEffective Date: ${r.effectiveDate}`);
  
  const handleProcess = (r: TerminationRequest) => {
    setRequests(prev => prev.map(req => req.id === r.id ? { ...req, status: "processed" } : req));
    alert(`✅ ${r.employeeName}'s termination processed. Documents and compensation ready.`);
  };

  const handleSubmit = (data: Partial<TerminationRequest>) => {
    const newRequest: TerminationRequest = {
      id: String(Date.now()), employeeName: data.employeeName || "", employeeId: data.employeeId || "",
      department: data.department || "", position: data.position || "", terminationType: data.terminationType || "termination",
      effectiveDate: data.effectiveDate || "", reason: data.reason || "", status: "submitted",
      submittedDate: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newRequest, ...prev]);
    alert(`✅ Termination request for ${newRequest.employeeName} submitted!`);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Employee Termination</h1>
          <p className="text-gray-500 text-sm mt-1">Manage employee termination, contract end, and compensation.</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <StatsGrid requests={requests} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{COLUMNS.map(c => <th key={c} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{c}</th>)}</tr>
            </thead>
            <tbody>
              {requests.map(r => <TerminationRequestRow key={r.id} request={r} onView={handleView} onProcess={handleProcess} />)}
            </tbody>
          </table>
        </div>
      </div>

      <TerminationFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}