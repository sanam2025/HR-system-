// core/modules/HR/pages/Complaints.tsx
import React, { useState } from "react";
import { AlertCircle, FileText, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";
import StatCard from "../Components/common_Components/StatCard";
import ComplaintTableRow from "../Components/Special_Components/ComplaintTableRow";
import ResignationTableRow from "../Components/Special_Components/ResignationTableRow";import type { 
  Complaint, 
  ComplaintStatus, 
  ResignationRequest, 
  ResignationStatus,
  ComplaintsStats,
  ResignationStats
} from "../types/complaints.types";
import { 
  calculateComplaintStats, 
  calculateResignationStats,
   
} from "../types/complaints.types";

// ============= Data (Static) =============

const complaints: Complaint[] = [
  {
    id: "1",
    employeeName: "Karim Salman",
    department: "Student Affairs",
    subject: "Workplace Harassment",
    description: "Complaint about inappropriate behavior from colleague",
    priority: "high",
    status: "open",
    submittedDate: "2026-05-10",
    assignedTo: "HR Manager",
  },
  {
    id: "2",
    employeeName: "Mohammed Al-Hassan",
    department: "Information Technology Engineering",
    subject: "Salary Discrepancy",
    description: "Salary amount doesn't match contract",
    priority: "medium",
    status: "inProgress",
    submittedDate: "2026-05-14",
    assignedTo: "Payroll Department",
  },
  {
    id: "3",
    employeeName: "Rana Al-Ali",
    department: "Basic Sciences",
    subject: "Leave Request Denied",
    description: "Annual leave request was denied without reason",
    priority: "low",
    status: "resolved",
    submittedDate: "2026-04-30",
    resolvedDate: "2026-05-05",
    assignedTo: "Department Head",
  },
];

const resignations: ResignationRequest[] = [
  {
    id: "1",
    employeeName: "Mahmoud Al-Hassan",
    department: "Information Technology Engineering",
    position: "Senior Developer",
    lastWorkingDay: "2026-06-15",
    reason: "Better career opportunity",
    status: "pending",
    submittedDate: "2026-05-20",
  },
  {
    id: "2",
    employeeName: "Wael Al-Masri",
    department: "Electrical Engineering",
    position: "Department Head",
    lastWorkingDay: "2026-05-30",
    reason: "Personal reasons",
    status: "approved",
    submittedDate: "2026-05-01",
    approvedDate: "2026-05-05",
    notes: "Approved with 2 weeks notice",
  },
  {
    id: "3",
    employeeName: "Lama Al-Zoubi",
    department: "Administration and Planning",
    position: "Project Manager",
    lastWorkingDay: "2026-05-20",
    reason: "Relocation",
    status: "rejected",
    submittedDate: "2026-04-25",
  },
];

type TabType = "complaints" | "resignations";

// ============= Main Component =============

export default function Complaints() {
  const [activeTab, setActiveTab] = useState<TabType>("complaints");
  const [complaintsList, setComplaintsList] = useState<Complaint[]>(complaints);
  const [resignationsList, setResignationsList] = useState<ResignationRequest[]>(resignations);

  const complaintStats: ComplaintsStats = calculateComplaintStats(complaintsList);
  const resignationStats: ResignationStats = calculateResignationStats(resignationsList);

  // Complaint handlers
  const handleComplaintView = (complaint: Complaint) => {
    console.log("View complaint:", complaint);
  };

  const handleComplaintEdit = (complaint: Complaint) => {
    console.log("Edit complaint:", complaint);
  };

  const handleComplaintStatusChange = (complaint: Complaint, newStatus: ComplaintStatus) => {
    setComplaintsList(prev =>
      prev.map(c => c.id === complaint.id ? { ...c, status: newStatus } : c)
    );
    console.log(`Complaint ${complaint.id} status changed to ${newStatus}`);
  };

  // Resignation handlers
  const handleResignationView = (request: ResignationRequest) => {
    console.log("View resignation:", request);
  };

  const handleResignationEdit = (request: ResignationRequest) => {
    console.log("Edit resignation:", request);
  };

  const handleResignationStatusChange = (request: ResignationRequest, newStatus: ResignationStatus) => {
    setResignationsList(prev =>
      prev.map(r => r.id === request.id ? { ...r, status: newStatus } : r)
    );
    console.log(`Resignation ${request.id} status changed to ${newStatus}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Complaints & Resignations</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage employee complaints and review resignation requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "complaints"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Complaints ({complaintsList.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("resignations")}
          className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "resignations"
              ? "text-blue-600 border-blue-600"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Resignation Requests ({resignationsList.length})
          </div>
        </button>
      </div>

      {/* Complaints Tab Content */}
      {activeTab === "complaints" && (
        <>
          {/* Complaints Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            <StatCard title="Total Complaints" value={complaintStats.total} icon={<AlertCircle className="w-5 h-5" />} color="blue" />
            <StatCard title="Open" value={complaintStats.open} icon={<AlertCircle className="w-5 h-5" />} color="red" />
            <StatCard title="In Progress" value={complaintStats.inProgress} icon={<Clock className="w-5 h-5" />} color="orange" />
            <StatCard title="Resolved" value={complaintStats.resolved} icon={<CheckCircle className="w-5 h-5" />} color="green" />
            <StatCard title="High Priority" value={complaintStats.highPriority} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
          </div>

          {/* Complaints Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {complaintsList.map((complaint) => (
                    <ComplaintTableRow
                      key={complaint.id}
                      complaint={complaint}
                      onView={handleComplaintView}
                      onEdit={handleComplaintEdit}
                      onStatusChange={handleComplaintStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {complaintsList.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No complaints found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Resignations Tab Content */}
      {activeTab === "resignations" && (
        <>
          {/* Resignations Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Requests" value={resignationStats.total} icon={<FileText className="w-5 h-5" />} color="blue" />
            <StatCard title="Pending" value={resignationStats.pending} icon={<Clock className="w-5 h-5" />} color="orange" />
            <StatCard title="Approved" value={resignationStats.approved} icon={<CheckCircle className="w-5 h-5" />} color="green" />
            <StatCard title="Rejected" value={resignationStats.rejected} icon={<XCircle className="w-5 h-5" />} color="red" />
          </div>

          {/* Resignations Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Working Day</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Submitted Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                 {resignationsList.map((resignation) => (  // <- غيرت من request إلى resignation
  <ResignationTableRow
    key={resignation.id}
    resignation={resignation}  // <- غيرت من request إلى resignation
    onView={handleResignationView}
    onEdit={handleResignationEdit}
    onStatusChange={handleResignationStatusChange}
  />
))}
                </tbody>
              </table>
            </div>

            {resignationsList.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No resignation requests found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}