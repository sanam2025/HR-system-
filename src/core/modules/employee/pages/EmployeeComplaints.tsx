import { useState } from "react";
import type { FormEvent } from "react";
import { MessageSquareWarning } from "lucide-react";
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
          setSuccessMessage("Complaint submitted successfully.");
          setSubject(null);
          setTitle("");
          setDescription("");
        },
      }
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Complaints</h1>
        <p className="text-sm text-gray-400 mt-1">File a complaint and track the ones you've submitted.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
          <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MessageSquareWarning size={16} aria-hidden="true" />
            <span>File a Complaint</span>
          </header>
          <form onSubmit={handleSubmit} className="space-y-3">
            {createComplaint.isError && (
              <p role="alert" className="text-xs text-red-600">
                {(createComplaint.error as ApiError).message}
              </p>
            )}
            {successMessage && (
              <p role="status" className="text-xs text-green-600">
                {successMessage}
              </p>
            )}
            <PersonPicker
              label="Who is this about?"
              people={directory.people}
              isLoading={directory.isLoading}
              errorMessage={(directory.error as ApiError | null)?.message ?? null}
              value={subject}
              onChange={setSubject}
            />
            <div>
              <label htmlFor="complaint-title" className="block text-xs text-gray-500 mb-1">
                Title
              </label>
              <input
                id="complaint-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              />
            </div>
            <div>
              <label htmlFor="complaint-description" className="block text-xs text-gray-500 mb-1">
                Description
              </label>
              <textarea
                id="complaint-description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
              />
            </div>
            <button
              type="submit"
              disabled={createComplaint.isPending || !subject}
              className="w-full py-2.5 bg-green text-white rounded-xl text-sm font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createComplaint.isPending ? "Submitting…" : "Submit Complaint"}
            </button>
          </form>
        </article>

        <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
          <h3 className="text-sm font-semibold text-dark mb-3 sm:mb-4">My Complaints</h3>
          {myComplaints.isLoading ? (
            <LoadingSkeleton lines={4} />
          ) : myComplaints.isError ? (
            <QueryErrorNotice message={(myComplaints.error as ApiError).message} />
          ) : !myComplaints.data || myComplaints.data.length === 0 ? (
            <p className="text-sm text-gray-400">You haven't filed any complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {myComplaints.data.map((complaint) => (
                <div key={complaint.id} className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-dark">{complaint.title}</p>
                    {complaint.status && (
                      <Badge variant={statusVariant(complaint.status)}>{humanizeStatus(complaint.status)}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{complaint.description}</p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
