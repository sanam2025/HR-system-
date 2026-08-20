import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { useOffers } from '../../hooks/useOffer';
import { useJobPostings } from '../../hooks/useJobPostings';
import Loading from '../../../../../shared/components/Loading';
import { useLanguage } from '../../../../../i18n/translations/LanguageContext';

export const Offers = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  
  const [selectedJobId, setSelectedJobId] = useState<number | undefined>(jobId ? Number(jobId) : undefined);

  useEffect(() => {
    if (jobId) {
      setSelectedJobId(Number(jobId));
    }
  }, [jobId]);

  const { postings, isLoading: isLoadingPostings } = useJobPostings();
  const { offers, isLoading: isLoadingOffers, error } = useOffers(selectedJobId);
  const { t, lang } = useLanguage();

  const isLoading = isLoadingPostings || (selectedJobId && isLoadingOffers);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-red-500">{t.hrOffers?.errorLoading || 'Error loading offers:'} {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.hrOffers?.title || 'Offers'}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {t.hrOffers?.subtitle || 'Manage offers for this job posting'}
            </p>
          </div>
          {selectedJobId && (
            <button
              onClick={() => navigate(`/Hr/job-postings/${selectedJobId}/offers/send`)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.hrOffers?.newOffer || 'New Offer'}
            </button>
          )}
        </div>

        {!jobId && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.hrOffers?.selectJobPosting || 'Select Job Posting'}</label>
            <select
              className="w-full md:w-1/3 border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
            >
              <option value="" disabled>{t.hrOffers?.selectJobPostingPlaceholder || 'Select a job posting...'}</option>
              {postings.map(post => (
                <option key={post.id} value={post.id}>{post.job_title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedJobId ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t.hrOffers?.pleaseSelectJob || 'Please select a job posting to view its offers'}</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t.hrOffers?.noOffersSent || 'No offers sent yet'}</p>
          <button
            onClick={() => navigate(`/Hr/job-postings/${selectedJobId}/offers/send`)}
            className="mt-4 text-orange-500 hover:text-orange-700 font-medium"
          >
            {t.hrOffers?.sendFirstOffer || 'Send your first offer \u2192'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrOffers?.table?.candidate || 'Candidate'}</th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrOffers?.table?.hourPrice || 'Hour Price'}</th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrOffers?.table?.startDate || 'Start Date'}</th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrOffers?.table?.status || 'Status'}</th>
                  <th className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.hrOffers?.table?.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {offer.candidate?.full_name || `Candidate #${offer.candidate_id}`}
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        offer.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : offer.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : offer.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                      }`}>
                        {t.hrOffers?.statuses?.[offer.status as keyof typeof t.hrOffers.statuses] || offer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/Hr/offers/${offer.id}`)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        {t.hrOffers?.table?.view || 'View'}
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