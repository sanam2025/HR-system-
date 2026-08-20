import { useState } from "react";
import type { FormEvent } from "react";
import { MessageSquareWarning, Search, List } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { PersonPicker } from "../components/speciel-components/PersonPicker";
import { useCreateComplaint, useMyComplaints } from "../../../../api/hooks/useComplaints";
import { usePeopleDirectory } from "../../../../api/hooks/usePeople";
import { ApiError } from "../../../../lib/http/ApiError";
import { humanizeStatus } from "../../../../lib/text";
import type { Colleague } from "../../../../api/models";

function statusVariant(status?: string): "success" | "warning" | "danger" | "default" {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "resolved" || normalized === "closed") return "success";
  if (normalized === "under_review" || normalized === "under-review") return "warning";
  if (normalized === "rejected") return "danger";
  return "default";
}

export default function EmployeeComplaints() {
  const myComplaints = useMyComplaints();
  const createComplaint = useCreateComplaint();
  const directory = usePeopleDirectory();

  const [subject, setSubject] = useState<Colleague | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject || !title || !description) return;
    setSuccessMessage(null);
    createComplaint.mutate(
      { subject_id: subject.id, title, description },
      {
        onSuccess: () => {
          setSuccessMessage("Complaint submitted successfully. - تم إرسال الشكوى بنجاح.");
          setSubject(null);
          setTitle("");
          setDescription("");
        },
      }
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Complaints - الشكاوي</h1>
        <p className="text-sm text-gray-500 mt-1">File a complaint and track the ones you've submitted.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* TOP/RIGHT SIDE: File a complaint */}
        <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-200 relative overflow-hidden transition-all h-fit">
          <div className="absolute top-0 start-0 w-2 h-full bg-[#3A6246]" />
          <header className="flex items-center gap-3 text-[#3A6246] font-bold text-xl mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-[#4A7C59]/15 rounded-xl text-[#3A6246]">
              <MessageSquareWarning size={24} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span>File a Complaint - تقديم شكوى</span>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {createComplaint.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                {(createComplaint.error as ApiError).message}
              </div>
            )}
            {successMessage && (
              <div className="bg-[#4A7C59]/10 border border-[#4A7C59]/30 text-[#3A6246] px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#3A6246] animate-pulse"></div>
                {successMessage}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="[&_label]:block [&_label]:text-xs [&_label]:font-bold [&_label]:text-gray-700 [&_label]:mb-2 [&_input]:w-full [&_input]:px-5 [&_input]:py-3.5 [&_input]:rounded-2xl [&_input]:border-2 [&_input]:border-gray-300 [&_input]:text-sm [&_input]:font-bold [&_input]:text-gray-900 [&_input]:focus:outline-none [&_input]:focus:ring-4 [&_input]:focus:ring-[#4A7C59]/20 [&_input]:focus:border-[#4A7C59] [&_input]:transition-all [&_input]:bg-gray-50/80 [&_input]:hover:bg-white">
                <PersonPicker
                  label="Who is this about? - عمّن هذه الشكوى؟"
                  people={directory.people}
                  isLoading={directory.isLoading}
                  errorMessage={(directory.error as ApiError | null)?.message ?? null}
                  value={subject}
                  onChange={setSubject}
                />
              </div>

              <div>
                <label htmlFor="complaint-title" className="block text-xs font-bold text-gray-700 mb-2">
                  Title - عنوان الشكوى
                </label>
                <input
                  id="complaint-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Inappropriate behavior..."
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-300 text-sm font-bold text-gray-900 bg-gray-50/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all"
                />
              </div>

              <div>
                <label htmlFor="complaint-description" className="block text-xs font-bold text-gray-700 mb-2">
                  Description - التفاصيل
                </label>
                <textarea
                  id="complaint-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the incident in detail..."
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-300 text-sm font-bold text-gray-900 bg-gray-50/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createComplaint.isPending || !subject}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#3A6246] text-white rounded-2xl text-base font-bold shadow-lg shadow-[#3A6246]/30 hover:bg-[#2C4A35] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none"
            >
              <MessageSquareWarning size={18} />
              {createComplaint.isPending ? "Submitting... - جاري الإرسال" : "Submit Complaint - إرسال الشكوى"}
            </button>
          </form>
        </article>

        {/* BOTTOM/LEFT SIDE: My Complaints list */}
        <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-200 h-fit relative overflow-hidden">
          <div className="absolute top-0 start-0 w-2 h-full bg-gray-400" />
          <header className="flex items-center gap-3 text-gray-800 font-bold text-xl mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-gray-200 rounded-xl text-gray-700">
              <List size={24} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span>My Complaints - شكاويي</span>
          </header>

          {myComplaints.isLoading ? (
            <LoadingSkeleton lines={4} />
          ) : myComplaints.isError ? (
            <QueryErrorNotice message={(myComplaints.error as ApiError).message} />
          ) : !myComplaints.data || myComplaints.data.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
               <MessageSquareWarning className="mx-auto text-gray-400 mb-3" size={48} strokeWidth={1.5} />
               <p className="text-sm font-bold text-gray-500">You haven't filed any complaints yet.<br/>لم تقم بتقديم أي شكوى بعد.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.data.map((complaint) => (
                <div key={complaint.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-base font-bold text-gray-900 leading-tight group-hover:text-[#3A6246] transition-colors break-words min-w-0">{complaint.title}</p>
                    {complaint.status && (
                      <div className="flex-shrink-0">
                         <Badge variant={statusVariant(complaint.status)}>{humanizeStatus(complaint.status)}</Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 bg-white p-4 rounded-xl border border-gray-200 whitespace-pre-wrap break-words shadow-sm">{complaint.description}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
