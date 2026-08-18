// src/core/modules/HR/pages/Interviews/InterviewCard.tsx
import React from "react";
import {
  Calendar,
  User,
  MapPin,
  X,
  Clock,
  Eye,
  Briefcase,
  Trophy,
  Medal,
} from "lucide-react";
import type { Interview } from "../../../../../api/service/HrService/Types/InterviewsService.types";

interface InterviewCardProps {
  interview: Interview;
  onCancel: (id: number) => void;
  isUpdating: boolean;
  onViewDetails: () => void;
  onSendOffer?: () => void;
  showOfferButton?: boolean;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onCancel,
  isUpdating,
  onViewDetails,
  onSendOffer,
  
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "on_site":
        return <MapPin className="w-4 h-4" />;
      case "online":
        return <User className="w-4 h-4" />;
      case "phone":
        return <Clock className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  // ✅ دالة لعرض أيقونة الترتيب
  const getRankIcon = (rank?: number) => {
    if (!rank) return null;
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="text-xs text-gray-400">#{rank}</span>;
    }
  };

  const candidateName = interview.candidate?.full_name ||
    (interview.candidate_id ? `Candidate #${interview.candidate_id}` : "N/A");
  const interviewerName = interview.interviewer?.full_name ||
    (interview.interviewed_by ? `Interviewer #${interview.interviewed_by}` : "N/A");
  const candidateEmail = interview.candidate?.email ||
    `ID: ${interview.candidate_id || "N/A"}`;

  const isDone = interview.status === 'done' || interview.status === 'completed';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
            {candidateName.charAt(0) || "?"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{candidateName}</p>
            <p className="text-xs text-gray-500">{candidateEmail}</p>
            {/* ✅ عرض الرتبة بجانب الاسم */}
            {interview.rank && (
              <div className="flex items-center gap-1 mt-0.5">
                {getRankIcon(interview.rank)}
                <span className="text-xs font-medium text-gray-600">
                  Rank #{interview.rank}
                </span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <div className="text-sm text-gray-900">
              {new Date(interview.scheduled_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(interview.scheduled_at).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          {getLocationIcon(interview.location_type)}
          <span className="text-sm text-gray-900 capitalize">
            {interview.location_type?.replace("_", " ") || "N/A"}
          </span>
        </div>
        {interview.location_details && (
          <div className="text-xs text-gray-500 mt-1">
            {interview.location_details}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{interviewerName}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <span
            className={`px-2 py-1 text-xs rounded-full inline-flex items-center gap-1 w-fit ${getStatusColor(interview.status)}`}
          >
            {interview.status === 'done' && <span>✅</span>}
            {interview.status || "N/A"}
          </span>
          {interview.rate && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              Rate: {interview.rate}/10
            </div>
          )}
          {/* ✅ عرض الرتبة هنا أيضاً */}
          {interview.rank && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {getRankIcon(interview.rank)}
              <span>Rank: #{interview.rank}</span>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {interview.status === "scheduled" && (
            <button
              onClick={() => onCancel(interview.id)}
              disabled={isUpdating}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Cancel Interview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onViewDetails}
            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isDone && onSendOffer && (
            <button
              onClick={onSendOffer}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 hover:shadow-md transition-all"
              title="Send Offer to Candidate"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Send Offer
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default InterviewCard;