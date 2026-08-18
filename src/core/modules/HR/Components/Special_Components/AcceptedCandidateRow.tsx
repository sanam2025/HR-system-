// core/modules/HR/Components/Special_Components/AcceptedCandidateRow.tsx
import React from "react";
import { Send, Briefcase, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import type { AcceptedCandidate, OfferStatus } from "../../types/acceptedCandidates.types";

interface AcceptedCandidateRowProps {
  candidate: AcceptedCandidate;
  onSendOffer: (candidate: AcceptedCandidate) => void;
  onConvertToEmployee: (candidate: AcceptedCandidate) => void;
  onViewDetails: (candidate: AcceptedCandidate) => void;
}

const offerStatusConfig: Record<OfferStatus, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700", icon: <Clock className="w-3 h-3" /> },
  sent: { label: "Offer Sent", className: "bg-blue-100 text-blue-700", icon: <Send className="w-3 h-3" /> },
  accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-700", icon: <CheckCircle className="w-3 h-3" /> },
  declined: { label: "Declined", className: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

export const AcceptedCandidateRow: React.FC<AcceptedCandidateRowProps> = ({
  candidate,
  onSendOffer,
  onConvertToEmployee,
  onViewDetails,
}) => {
  const offerStatus = offerStatusConfig[candidate.offerStatus];

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-3.5">
        <div>
          <div className="text-sm font-medium text-gray-800">{candidate.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{candidate.email}</div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{candidate.position}</td>
      <td className="px-5 py-3.5 text-sm text-gray-600">{candidate.department}</td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{candidate.interviewDate}</td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${offerStatus.className}`}>
          {offerStatus.icon}
          {offerStatus.label}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(candidate)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {candidate.offerStatus === "pending" && (
            <button
              onClick={() => onSendOffer(candidate)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green text-white rounded-lg hover:bg-green-dark transition-colors"
            >
              <Send className="w-3 h-3" />
              Send Offer
            </button>
          )}
          
          {candidate.offerStatus === "accepted" && candidate.employmentStatus === "pending" && (
            <button
              onClick={() => onConvertToEmployee(candidate)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Briefcase className="w-3 h-3" />
              Convert to Employee
            </button>
          )}
          
          {candidate.employmentStatus === "converted" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg">
              <CheckCircle className="w-3 h-3" />
              Employee
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AcceptedCandidateRow;