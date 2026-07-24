// src/core/modules/HR/pages/Offers/SendOffer.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, Clock } from "lucide-react";
import { useSendOffer } from "../../hooks/useOffer";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const SendOffer = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const [searchParams] = useSearchParams();
  const candidateIdFromUrl = searchParams.get("candidateId");

  const jobIdNumber = jobId ? Number(jobId) : undefined;
  const { mutate: sendOffer, isPending } = useSendOffer(jobIdNumber);

  const [form, setForm] = useState({
    hour_price: "",
    start_date: "",
    weekend_days: [] as string[],
    working_hour_per_day: "",
  });

  const weekendOptions = ["friday", "saturday", "sunday"];

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as { message?: string };
      return data?.message || err.message || "Failed to send offer";
    }
    if (err instanceof Error) {
      return err.message;
    }
    return "Failed to send offer";
  };

  // التأكد من وجود candidate_id
  useEffect(() => {
    if (!candidateIdFromUrl) {
      toast.error("No candidate selected");
      navigate(`/Hr/job-postings/${jobId}/interviews`);
    }
  }, [candidateIdFromUrl, jobId, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateIdFromUrl) {
      toast.error("No candidate selected");
      return;
    }

    if (!form.hour_price || !form.start_date || !form.working_hour_per_day) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.weekend_days.length === 0) {
      toast.error("Please select at least one weekend day");
      return;
    }

    const data = {
      candidate_id: Number(candidateIdFromUrl),
      hour_price: Number(form.hour_price),
      start_date: form.start_date,
      weekend_days: form.weekend_days,
      working_hour_per_day: Number(form.working_hour_per_day),
    };

    console.log("Sending offer:", data);

    sendOffer(data, {
      onSuccess: () => {
        toast.success("Offer sent successfully!");
        navigate(`/Hr/job-postings/${jobId}/offers`);
      },
      onError: (err: unknown) => {
        console.error("Send offer error:", err);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/Hr/job-postings/${jobId}/offers`)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Offers
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Send Offer</h1>
          <p className="text-gray-500 text-sm mt-1">
            Send a job offer to the candidate
            {candidateIdFromUrl && (
              <span className="text-purple-600 block mt-1">
                Sending offer to Candidate #{candidateIdFromUrl}
              </span>
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Candidate ID مخفي (يؤخذ من الـ URL تلقائياً) */}
            <div className="hidden">
              <input
                type="number"
                name="candidate_id"
                value={candidateIdFromUrl || ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hour Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="hour_price"
                  value={form.hour_price}
                  onChange={handleChange}
                  placeholder="Enter hour price"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Working Hours Per Day *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="working_hour_per_day"
                  value={form.working_hour_per_day}
                  onChange={handleChange}
                  placeholder="Enter working hours per day"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekend Days *
              </label>
              <div className="flex flex-wrap gap-3">
                {weekendOptions.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWeekendToggle(day)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      form.weekend_days.includes(day)
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {form.weekend_days.join(", ") || "None"}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Send Offer"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/Hr/job-postings/${jobId}/offers`)}
                className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendOffer;
