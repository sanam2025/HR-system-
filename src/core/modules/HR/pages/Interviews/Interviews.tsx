// src/core/modules/HR/pages/Interviews/Interviews.tsx
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, XCircle, Send } from "lucide-react";
import { useInterviews } from "../../hooks/useInterviews";
import { useSendOffer } from "../../hooks/useOffer";
import InterviewCard from "./InterviewCard";
import InterviewStats from "./InterviewStats";
import InterviewFilters from "./InterviewFilters";
import { useState, useEffect, useMemo } from "react";
import type { Interview } from "../../../../../api/service/HrService/Types/InterviewsService.types";
import toast from "react-hot-toast";

export const Interviews = () => {
  const navigate = useNavigate();
  const { jobId: jobIdFromParams } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const jobIdFromQuery = searchParams.get("jobId");

  const jobId = jobIdFromParams || jobIdFromQuery;
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<{
    id: number;
    name: string;
    interviewId: number;
    email?: string;
  } | null>(null);

  const { interviews, isLoading, error, cancelInterview, isUpdating, refetch } =
    useInterviews(jobIdNumber);

  const { mutate: sendOffer, isPending: isSendingOffer } =
    useSendOffer(jobIdNumber);

  useEffect(() => {
    if (jobIdNumber) {
      refetch();
    }
  }, [jobIdNumber, refetch]);

  // ✅ ترتيب المقابلات حسب الرتبة (الأقل رقم أولاً)
  const sortedInterviews = useMemo(() => {
    return [...interviews].sort((a, b) => {
      // إذا كان هناك رتبة، رتب حسبها
      if (a.rank !== undefined && b.rank !== undefined) {
        return a.rank - b.rank;
      }
      // إذا كانت إحداهما لها رتبة والأخرى لا، التي لها رتبة تسبق
      if (a.rank !== undefined) return -1;
      if (b.rank !== undefined) return 1;
      // إذا لم تكن هناك رتب، رتب حسب التاريخ
      return (
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      );
    });
  }, [interviews]);

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i: Interview) => i.status === "scheduled")
      .length,
    completed: interviews.filter(
      (i: Interview) => i.status === "completed" || i.status === "done",
    ).length,
    cancelled: interviews.filter((i: Interview) => i.status === "cancelled")
      .length,
  };

  const getCandidateName = (interview: Interview): string => {
    if (interview.candidate?.full_name) {
      return interview.candidate.full_name;
    }
    if (interview.candidate_id) {
      return `Candidate #${interview.candidate_id}`;
    }
    return "N/A";
  };

  const filteredInterviews = sortedInterviews.filter((interview: Interview) => {
    const candidateName = getCandidateName(interview).toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = candidateName.includes(search);
    const matchesStatus =
      statusFilter === "all" || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenOfferModal = (
    candidateId: number,
    candidateName: string,
    interviewId: number,
    email?: string,
  ) => {
    if (!jobIdNumber) {
      toast.error("No job ID found");
      return;
    }
    setSelectedCandidate({
      id: candidateId,
      name: candidateName,
      interviewId: interviewId,
      email: email,
    });
    setShowOfferModal(true);
  };

  const handleConfirmSendOffer = () => {
    if (!selectedCandidate || !jobIdNumber) return;

    sendOffer(
      {
        candidate_id: selectedCandidate.id,
        hour_price: 15,
        start_date: new Date().toISOString().split("T")[0],
        weekend_days: ["friday", "saturday"],
        working_hour_per_day: 8,
      },
      {
        onSuccess: () => {
          setShowOfferModal(false);
          setSelectedCandidate(null);
          refetch();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-500">Error loading interviews: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate("/Hr/job-postings")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Postings
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage interviews for this job posting
            </p>
          </div>
        </div>
      </div>

      <InterviewStats stats={stats} />
      <InterviewFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interviewer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInterviews.map((interview: Interview) => {
                const isDone =
                  interview.status === "done" ||
                  interview.status === "completed";
                const candidateId = interview.candidate_id;
                const candidateName = getCandidateName(interview);
                const candidateEmail = interview.candidate?.email;

                return (
                  <InterviewCard
                    key={interview.id}
                    interview={interview}
                    onCancel={(id) => cancelInterview(id)}
                    isUpdating={isUpdating}
                    onViewDetails={() =>
                      navigate(`/Hr/interviews/${interview.id}`)
                    }
                    onSendOffer={
                      isDone && candidateId
                        ? () =>
                            handleOpenOfferModal(
                              candidateId,
                              candidateName,
                              interview.id,
                              candidateEmail,
                            )
                        : undefined
                    }
                    showOfferButton={isDone && !!candidateId}
                  />
                );
              })}
              {filteredInterviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No interviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Offer Confirmation Modal */}
      {showOfferModal && selectedCandidate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowOfferModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Send Offer</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to send an offer to <br />
                <span className="font-semibold text-gray-700">
                  {selectedCandidate.name}
                </span>
                ?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Candidate ID</p>
                  <p className="font-medium text-gray-900">
                    #{selectedCandidate.id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Job Posting</p>
                  <p className="font-medium text-gray-900">#{jobIdNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Interview</p>
                  <p className="font-medium text-gray-900">
                    #{selectedCandidate.interviewId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    Completed
                  </span>
                </div>
                {selectedCandidate.email && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {selectedCandidate.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-orange-600 font-medium mb-2">
                Offer Details
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Hour Price</p>
                  <p className="font-medium text-gray-900">$15.00</p>
                </div>
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toISOString().split("T")[0]}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Working Hours</p>
                  <p className="font-medium text-gray-900">
                    8 hours/day | Fri, Sat off
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSendOffer}
                disabled={isSendingOffer}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 ${
                  isSendingOffer
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
                }`}
              >
                {isSendingOffer ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Offer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
