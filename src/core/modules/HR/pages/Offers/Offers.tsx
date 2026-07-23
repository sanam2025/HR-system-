// src/core/modules/HR/pages/Offers/Offers.tsx
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Briefcase, Calendar, DollarSign } from "lucide-react";
import { useOffers } from "../../hooks/useOffer";
import Loading from "../../../../../shared/components/Loading";

export const Offers = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const jobIdNumber = jobId ? Number(jobId) : undefined;

  const { offers, isLoading, error } = useOffers(jobIdNumber);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-red-500">Error loading offers: {error}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage offers for this job posting
            </p>
          </div>
          <button
            onClick={() => navigate(`/Hr/job-postings/${jobId}/offers/send`)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Offer
          </button>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No offers sent yet</p>
          <button
            onClick={() => navigate(`/Hr/job-postings/${jobId}/offers/send`)}
            className="mt-4 text-orange-500 hover:text-orange-700 font-medium"
          >
            Send your first offer →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hour Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {offer.candidate?.full_name ||
                          `Candidate #${offer.candidate_id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        {offer.hour_price}/hour
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(offer.start_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          offer.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : offer.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : offer.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/Hr/offers/${offer.id}`)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
