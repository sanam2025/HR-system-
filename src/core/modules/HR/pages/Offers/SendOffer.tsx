import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, Clock } from "lucide-react";
import { useSendOffer } from "../../hooks/useOffer";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";

export const SendOffer = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const candidateIdFromUrl = searchParams.get("candidateId");

  const { jobIdNumber } = { jobIdNumber: jobId ? Number(jobId) : undefined };
  const { mutate: sendOffer, isPending } = useSendOffer(jobIdNumber);
  const { t, lang } = useLanguage();

  const [form, setForm] = useState({
    hour_price: "",
    start_date: "",
    weekend_days: [] as string[],
    working_hours_per_day: "",
  });

  const weekendOptions = ["friday", "saturday", "sunday"];

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as { message?: string };
      return data?.message || err.message || (t.hrOffers?.toasts?.failedSend || "Failed to send offer");
    }
    if (err instanceof Error) {
      return err.message;
    }
    return t.hrOffers?.toasts?.failedSend || "Failed to send offer";
  };

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidateIdFromUrl || "");
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (jobIdNumber) {
      import('../../../../../api/service/HrService/CandidatesService').then(({ CandidatesService }) => {
        CandidatesService.getByJobId(jobIdNumber)
          .then((res) => {
            const data = res.data as any;
            const candidatesArray = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.candidates) ? data.candidates : [];
            setCandidates(candidatesArray);
          })
          .catch((err) => console.error(err));
      });
    }
  }, [jobIdNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateToUse = candidateIdFromUrl || selectedCandidateId;

    if (!candidateToUse) {
      toast.error(t.hrOffers?.toasts?.noCandidate || "No candidate selected");
      return;
    }

    if (!form.hour_price || !form.start_date || !form.working_hours_per_day) {
      toast.error(t.hrOffers?.toasts?.fillRequired || "Please fill in all required fields");
      return;
    }

    if (form.weekend_days.length === 0) {
      toast.error(t.hrOffers?.toasts?.selectWeekend || "Please select at least one weekend day");
      return;
    }

    const data = {
      candidate_id: Number(candidateToUse),
      hour_price: Number(form.hour_price),
      start_date: form.start_date,
      weekend_days: form.weekend_days,
      working_hours_per_day: Number(form.working_hours_per_day),
    };

    console.log(" Sending offer:", data);    navigate(-1);    sendOffer(data, {
      onSuccess: () => {        toast.success(t.hrOffers?.toasts?.offerSent || "Offer sent successfully!");
      },
      onError: (err: unknown) => {
        console.error(" Send offer error:", err);
        toast.error(getErrorMessage(err));
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleWeekendToggle = (day: string) => {
    setForm((prev) => ({
      ...prev,
      weekend_days: prev.weekend_days.includes(day)
        ? prev.weekend_days.filter((d) => d !== day)
        : [...prev.weekend_days, day],
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)} //  إغلاق الفورم فوراً عند الضغط على الرجوع
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} /> {t.hrOffers?.sendOffer?.back || 'Back'}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t.hrOffers?.sendOffer?.title || 'Send Offer'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t.hrOffers?.sendOffer?.subtitle || 'Send a job offer to the candidate'}
            {candidateIdFromUrl && (
              <span className="text-purple-600 block mt-1">
                 {t.hrOffers?.sendOffer?.sendingTo || 'Sending offer to Candidate #'}{candidateIdFromUrl}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!candidateIdFromUrl ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.hrOffers?.sendOffer?.candidateLabel || 'Candidate *'}
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-green focus:ring-green"
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  required
                >
                  <option value="" disabled>{t.hrOffers?.sendOffer?.selectCandidate || 'Select Candidate'}</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="hidden">
                <input
                  type="number"
                  name="candidate_id"
                  value={candidateIdFromUrl}
                  readOnly
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.hrOffers?.sendOffer?.hourPriceLabel || 'Hour Price ($) *'}
              </label>
              <div className="relative">
                <DollarSign className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="number"
                  name="hour_price"
                  value={form.hour_price}
                  onChange={handleChange}
                  placeholder={t.hrOffers?.sendOffer?.hourPricePlaceholder || 'Enter hour price'}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:border-green focus:ring-green`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.hrOffers?.sendOffer?.startDateLabel || 'Start Date *'}
              </label>
              <div className="relative">
                <Calendar className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:border-green focus:ring-green text-left`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.hrOffers?.sendOffer?.workingHoursLabel || 'Working Hours Per Day *'}
              </label>
              <div className="relative">
                <Clock className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="number"
                  name="working_hours_per_day"
                  value={form.working_hours_per_day}
                  onChange={handleChange}
                  placeholder={t.hrOffers?.sendOffer?.workingHoursPlaceholder || 'Enter working hours per day'}
                  className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-lg focus:ring-2 focus:border-green focus:ring-green`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.hrOffers?.sendOffer?.weekendDaysLabel || 'Weekend Days *'}
              </label>
              <div className="flex flex-wrap gap-3">
                {weekendOptions.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWeekendToggle(day)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      form.weekend_days.includes(day)
                        ? "bg-green text-white border-green"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {t.hrOffers?.days?.[day as keyof typeof t.hrOffers.days] || (day.charAt(0).toUpperCase() + day.slice(1))}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t.hrOffers?.sendOffer?.selected || 'Selected:'} {form.weekend_days.map(d => t.hrOffers?.days?.[d as keyof typeof t.hrOffers.days] || d).join(", ") || (t.hrOffers?.sendOffer?.none || "None")}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors disabled:opacity-50"
              >
                {isPending ? (t.hrOffers?.sendOffer?.sending || 'Sending...') : (t.hrOffers?.sendOffer?.sendOfferBtn || 'Send Offer')}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)} //  إغلاق الفورم فوراً عند الضغط على Cancel
                className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t.hrOffers?.sendOffer?.cancel || 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendOffer;