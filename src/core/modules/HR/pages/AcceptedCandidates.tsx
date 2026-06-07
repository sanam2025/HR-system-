// core/modules/HR/pages/AcceptedCandidates.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import AcceptedCandidateRow from "../Components/Special_Components/AcceptedCandidateRow";
import JobOfferModal from "../Components/Special_Components/JobOfferModal";
import type { AcceptedCandidate, JobOfferData } from "../types/acceptedCandidates.types";

// ============= Data (Static) =============
const acceptedCandidates: AcceptedCandidate[] = [
  {
    id: "1",
    name: "Ahmed Mansour",
    email: "ahmed.mansour@example.com",
    phone: "+963 11 1234567",
    position: "Web Developer",
    department: "Information Technology Engineering",
    interviewDate: "2026-06-05",
    interviewResult: "Excellent",
    offerStatus: "pending",
    employmentStatus: "pending",
  },
  {
    id: "2",
    name: "Sara Khalil",
    email: "sara.khalil@example.com",
    phone: "+963 11 2345678",
    position: "Web Developer",
    department: "Information Technology Engineering",
    interviewDate: "2026-06-04",
    interviewResult: "Very Good",
    offerStatus: "pending",
    employmentStatus: "pending",
  },
  {
    id: "3",
    name: "Omar Hassan",
    email: "omar.hassan@example.com",
    phone: "+963 11 3456789",
    position: "Web Developer",
    department: "Information Technology Engineering",
    interviewDate: "2026-06-03",
    interviewResult: "Outstanding",
    offerStatus: "accepted",
    employmentStatus: "pending",
    offerSentDate: "2026-06-05",
    offerAcceptedDate: "2026-06-06",
    salary: 2500000,
    startDate: "2026-07-01",
  },
];

export default function AcceptedCandidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<AcceptedCandidate[]>(acceptedCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<AcceptedCandidate | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const handleSendOffer = (candidate: AcceptedCandidate) => {
    setSelectedCandidate(candidate);
    setIsOfferModalOpen(true);
  };

  const handleSendOfferSubmit = (offerData: JobOfferData) => {
    setCandidates(prev => prev.map(c => 
      c.id === offerData.candidateId 
        ? { 
            ...c, 
            offerStatus: "sent", 
            offerSentDate: new Date().toISOString().split('T')[0],
            salary: offerData.salary,
            startDate: offerData.startDate
          } 
        : c
    ));
    alert(`✅ Job offer sent to ${offerData.candidateName} successfully!`);
  };

  const handleConvertToEmployee = (candidate: AcceptedCandidate) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidate.id 
        ? { ...c, employmentStatus: "converted" } 
        : c
    ));
    alert(`✅ ${candidate.name} has been converted to an employee successfully!`);
  };

  const handleViewDetails = (candidate: AcceptedCandidate) => {
    console.log("View details:", candidate);
    alert(`📋 ${candidate.name}\nPosition: ${candidate.position}\nInterview Date: ${candidate.interviewDate}\nResult: ${candidate.interviewResult}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate("/Hr/recruitment")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Recruitment
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Accepted Candidates</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage candidates who passed the manager interview.</p>
      </div>

      {/* Stats Cards - Removed */}

      {/* Candidates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Interview Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Offer Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map((candidate) => (
                <AcceptedCandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  onSendOffer={handleSendOffer}
                  onConvertToEmployee={handleConvertToEmployee}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {candidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No accepted candidates found</p>
          </div>
        )}
      </div>

      {/* Job Offer Modal */}
      <JobOfferModal
        isOpen={isOfferModalOpen}
        candidate={selectedCandidate}
        onClose={() => setIsOfferModalOpen(false)}
        onSend={handleSendOfferSubmit}
      />
    </div>
  );
}