// core/modules/HR/pages/Resignations.tsx
import React, { useState } from "react";
import { Eye, CheckCircle, XCircle, DollarSign } from "lucide-react";
import type { ResignationRequest } from "../types/resignation.types";

// ============= DATA =============
const ALL_RESIGNATIONS: ResignationRequest[] = [
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
const COLUMNS = [
  "Employee",
  "Department",
  "Position",
  "Last Working Day",
  "Actions",
];

// ============= COMPENSATION MODAL =============
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
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Set Compensation</h2>
          <p className="text-sm text-gray-500">Employee: {employeeName}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Compensation Amount (SYP)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="e.g., 5000000"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg"
            >
              Save Compensation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============= MAIN =============
export default function Resignations() {
  const [requests, setRequests] = useState(ALL_RESIGNATIONS);
  const [activeTab, setActiveTab] = useState<TabType>("standard");
  const [selected, setSelected] = useState<ResignationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = requests.filter((r) => r.resignationType === activeTab);

  const handleView = (r: ResignationRequest) =>
    alert(
      `📋 ${r.employeeName}\nReason: ${r.reason}\nLast Day: ${r.lastWorkingDay}`,
    );
  const handleApprove = (r: ResignationRequest) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === r.id
          ? {
              ...req,
              status: "approved",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : req,
      ),
    );
    alert(`✅ ${r.employeeName}'s resignation approved`);
  };
  const handleOpenModal = (r: ResignationRequest) => {
    setSelected(r);
    setIsModalOpen(true);
  };
  const handleSaveComp = (comp: number) => {
    if (selected) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? {
                ...r,
                status: "approved",
                compensationAmount: comp,
                approvedDate: new Date().toISOString().split("T")[0],
              }
            : r,
        ),
      );
      alert(
        `✅ ${selected.employeeName} approved with compensation: ${comp.toLocaleString()} SYP`,
      );
      setIsModalOpen(false);
      setSelected(null);
    }
  };
  const handleReject = (r: ResignationRequest) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === r.id ? { ...req, status: "rejected" } : req,
      ),
    );
    alert(`❌ ${r.employeeName}'s resignation rejected`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      <CompensationModal
        isOpen={isModalOpen}
        employeeName={selected?.employeeName || ""}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveComp}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Resignation Requests</h1>
        <p className="text-gray-500 text-sm">
          Manage standard and immediate resignation requests.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("standard")}
          className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === "standard" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
        >
          📄 Standard (
          {requests.filter((r) => r.resignationType === "standard").length})
        </button>
        <button
          onClick={() => setActiveTab("immediate")}
          className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === "immediate" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent"}`}
        >
          ⚡ Immediate (
          {requests.filter((r) => r.resignationType === "immediate").length})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div>
                      <div className="text-sm font-medium">
                        {r.employeeName}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {r.employeeId}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm">{r.department}</td>
                  <td className="px-5 py-3.5 text-sm">{r.position}</td>
                  <td className="px-5 py-3.5 text-sm">{r.lastWorkingDay}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(r)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {r.status === "pending" && (
                        <>
                          {activeTab === "immediate" ? (
                            <button
                              onClick={() => handleOpenModal(r)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded-lg"
                            >
                              <DollarSign className="w-3 h-3" />
                              Add Comp.
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(r)}
                              className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 text-white rounded-lg"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleReject(r)}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded-lg"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === "approved" && r.compensationAmount && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 rounded-lg">
                          <DollarSign className="w-3 h-3" />
                          {r.compensationAmount.toLocaleString()} SYP
                        </span>
                      )}
                      {r.status === "approved" &&
                        !r.compensationAmount &&
                        activeTab === "standard" && (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 rounded-lg">
                            <CheckCircle className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                      {r.status === "rejected" && (
                        <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 rounded-lg">
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

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">
            No {activeTab} resignation requests found
          </p>
        </div>
      )}
    </div>
  );
}
