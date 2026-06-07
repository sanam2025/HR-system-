// core/modules/HR/pages/Resignations.tsx
import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, DollarSign } from "lucide-react";
import type { ResignationRequest } from "../types/resignation.types";

// ============= Data (Static) =============
const allResignationRequests: ResignationRequest[] = [
  {
    id: "1",
    employeeName: "Ahmed Mansour",
    employeeId: "EMP001",
    department: "Information Technology",
    position: "Web Developer",
    resignationType: "standard",
    lastWorkingDay: "2026-07-15",
    submittedDate: "2026-06-01",
    reason: "Better career opportunity",
    status: "pending",
    baseSalary: 1500000,
    yearsOfService: 3,
  },
  {
    id: "2",
    employeeName: "Sara Khalil",
    employeeId: "EMP002",
    department: "Basic Sciences",
    position: "Professor",
    resignationType: "immediate",
    lastWorkingDay: "2026-06-10",
    submittedDate: "2026-06-05",
    reason: "Personal reasons",
    status: "pending",
    baseSalary: 2000000,
    yearsOfService: 5,
  },
  {
    id: "3",
    employeeName: "Omar Hassan",
    employeeId: "EMP003",
    department: "Electrical Engineering",
    position: "Department Head",
    resignationType: "standard",
    lastWorkingDay: "2026-08-01",
    submittedDate: "2026-05-20",
    reason: "Retirement",
    status: "approved",
    approvedDate: "2026-05-25",
    baseSalary: 2500000,
    yearsOfService: 10,
    compensationAmount: 25000000,
  },
  {
    id: "4",
    employeeName: "Nadia Ali",
    employeeId: "EMP004",
    department: "Administration",
    position: "HR Manager",
    resignationType: "immediate",
    lastWorkingDay: "2026-06-15",
    submittedDate: "2026-06-07",
    reason: "Relocation",
    status: "pending",
    baseSalary: 1800000,
    yearsOfService: 4,
  },
];

type TabType = "standard" | "immediate";

// Compensation Modal Component
const CompensationModal: React.FC<{
  isOpen: boolean;
  employeeName: string;
  onClose: () => void;
  onSubmit: (compensation: number) => void;
}> = ({ isOpen, employeeName, onClose, onSubmit }) => {
  const [compensation, setCompensation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(compensation));
    setCompensation("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Set Compensation</h2>
          <p className="text-sm text-gray-500 mt-1">Employee: {employeeName}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compensation Amount (SYP)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5000000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Save Compensation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Resignations() {
  const [requests, setRequests] = useState<ResignationRequest[]>(allResignationRequests);
  const [activeTab, setActiveTab] = useState<TabType>("standard");
  const [selectedEmployee, setSelectedEmployee] = useState<ResignationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const standardResignations = requests.filter(r => r.resignationType === "standard");
  const immediateResignations = requests.filter(r => r.resignationType === "immediate");
  const currentResignations = activeTab === "standard" ? standardResignations : immediateResignations;

  const handleView = (request: ResignationRequest) => {
    alert(`📋 ${request.employeeName}\nReason: ${request.reason}\nLast Day: ${request.lastWorkingDay}`);
  };

  const handleApproveStandard = (request: ResignationRequest) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id 
        ? { ...r, status: "approved", approvedDate: new Date().toISOString().split('T')[0] } 
        : r
    ));
    alert(`✅ ${request.employeeName}'s resignation has been approved!`);
  };

  const handleOpenCompensationModal = (request: ResignationRequest) => {
    setSelectedEmployee(request);
    setIsModalOpen(true);
  };

  const handleSaveCompensation = (compensation: number) => {
    if (selectedEmployee) {
      setRequests(prev => prev.map(r => 
        r.id === selectedEmployee.id 
          ? { ...r, status: "approved", compensationAmount: compensation, approvedDate: new Date().toISOString().split('T')[0] } 
          : r
      ));
      alert(`✅ ${selectedEmployee.employeeName}'s resignation has been approved with compensation: ${compensation.toLocaleString()} SYP`);
      setIsModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  const handleReject = (request: ResignationRequest) => {
    setRequests(prev => prev.map(r => 
      r.id === request.id ? { ...r, status: "rejected" } : r
    ));
    alert(`❌ ${request.employeeName}'s resignation has been rejected.`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <CompensationModal
        isOpen={isModalOpen}
        employeeName={selectedEmployee?.employeeName || ""}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCompensation}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resignation Requests</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage standard and immediate resignation requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("standard")}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "standard"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          📄 Standard Resignations ({standardResignations.length})
        </button>
        <button
          onClick={() => setActiveTab("immediate")}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "immediate"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          ⚡ Immediate Resignations ({immediateResignations.length})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Working Day</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentResignations.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{request.employeeName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">ID: {request.employeeId}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{request.department}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{request.position}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{request.lastWorkingDay}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => handleView(request)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          {activeTab === "immediate" ? (
                            <button onClick={() => handleOpenCompensationModal(request)} className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                              <DollarSign className="w-3 h-3" />
                              Add Compensation
                            </button>
                          ) : (
                            <button onClick={() => handleApproveStandard(request)} className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                          )}
                          <button onClick={() => handleReject(request)} className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === "approved" && request.compensationAmount && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg">
                          <DollarSign className="w-3 h-3" />
                          {request.compensationAmount.toLocaleString()} SYP
                        </span>
                      )}
                      {request.status === "approved" && !request.compensationAmount && activeTab === "standard" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg">
                          <CheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {currentResignations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No {activeTab === "standard" ? "standard" : "immediate"} resignation requests found</p>
        </div>
      )}
    </div>
  );
}