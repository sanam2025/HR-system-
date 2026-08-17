import { useState } from "react";
import useAuthStore from "../../../../store/authStore";
import { useMyOvertimeRequests, useCreateOvertimeRequest, useDeleteOvertimeRequest } from "../../../../api/hooks/useOvertime";
import { useMyTerminationRequests, useCreateTerminationRequest, useDeleteTerminationRequest } from "../../../../api/hooks/useTermination";
import { useMyComplaints, useCreateComplaint } from "../../../../api/hooks/useComplaints";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { ApiError } from "../../../../lib/http/ApiError";

function badgeVariantForStatus(status: string): "default" | "success" | "warning" | "danger" {
  const normalized = status.trim().toLowerCase();
  if (normalized === "approved" || normalized === "resolved") return "success";
  if (normalized === "rejected") return "danger";
  if (normalized === "pending" || normalized === "under_review") return "warning";
  return "default";
}

// ── Overtime ─────────────────────────────────────────────────────────────

function OvertimeSection() {
  const overtimes = useMyOvertimeRequests();
  const createOvertime = useCreateOvertimeRequest();
  const deleteOvertime = useDeleteOvertimeRequest();
  const items = overtimes.data?.items ?? [];

  const [form, setForm] = useState({ date: "", start_time: "", end_time: "", notes: "" });

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Overtime Requests</h2>

      <form
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createOvertime.mutate(form, {
            onSuccess: () => setForm({ date: "", start_time: "", end_time: "", notes: "" }),
          });
        }}
      >
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <input
          type="time"
          required
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <input
          type="time"
          required
          value={form.end_time}
          onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <button
          type="submit"
          disabled={createOvertime.isPending}
          className="col-span-2 sm:col-span-4 px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold disabled:opacity-60"
        >
          {createOvertime.isPending ? "Submitting…" : "Request overtime"}
        </button>
      </form>
      {createOvertime.isError && (
        <div className="mb-4">
          <QueryErrorNotice message={(createOvertime.error as ApiError).message} />
        </div>
      )}

      {overtimes.isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : overtimes.isError ? (
        <QueryErrorNotice message={(overtimes.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No overtime requests yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">
                {item.date} · {item.start_time}–{item.end_time}
              </span>
              <Badge variant={badgeVariantForStatus(item.status)}>{item.status}</Badge>
              {item.status.trim().toLowerCase() === "pending" && (
                <button
                  type="button"
                  onClick={() => deleteOvertime.mutate(item.id)}
                  disabled={deleteOvertime.isPending}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// ── Termination ──────────────────────────────────────────────────────────

function TerminationSection() {
  const userId = useAuthStore((state) => state.user?.id);
  const terminations = useMyTerminationRequests();
  const createTermination = useCreateTerminationRequest();
  const deleteTermination = useDeleteTerminationRequest();
  const items = terminations.data?.items ?? [];

  const [form, setForm] = useState({
    type: "immediate",
    termination_date: "",
    subtype: "resignation",
    legal_reason: "",
  });

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Termination Request</h2>
      <p className="text-xs text-gray-400 mb-3">
        Submit a resignation or termination request. This is reviewed by HR before it takes effect.
      </p>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!userId) return;
          createTermination.mutate(
            { ...form, user_id: userId },
            {
              onSuccess: () =>
                setForm({ type: "immediate", termination_date: "", subtype: "resignation", legal_reason: "" }),
            }
          );
        }}
      >
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        >
          <option value="immediate">Immediate</option>
          <option value="notice_period">Notice period</option>
        </select>
        <input
          type="date"
          required
          value={form.termination_date}
          onChange={(e) => setForm({ ...form, termination_date: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <select
          value={form.subtype}
          onChange={(e) => setForm({ ...form, subtype: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green sm:col-span-2"
        >
          <option value="resignation">Resignation</option>
          <option value="personal">Personal reasons</option>
          <option value="other">Other</option>
        </select>
        <textarea
          placeholder="Reason"
          required
          rows={3}
          value={form.legal_reason}
          onChange={(e) => setForm({ ...form, legal_reason: e.target.value })}
          className="sm:col-span-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <button
          type="submit"
          disabled={createTermination.isPending || !userId}
          className="sm:col-span-2 px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold disabled:opacity-60"
        >
          {createTermination.isPending ? "Submitting…" : "Submit request"}
        </button>
      </form>
      {createTermination.isError && (
        <div className="mb-4">
          <QueryErrorNotice message={(createTermination.error as ApiError).message} />
        </div>
      )}

      {terminations.isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : terminations.isError ? (
        <QueryErrorNotice message={(terminations.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No termination requests on file.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">
                {item.termination_date} · {item.subtype}
              </span>
              <Badge variant={badgeVariantForStatus(item.status)}>{item.status}</Badge>
              {item.status.trim().toLowerCase() === "pending" && (
                <button
                  type="button"
                  onClick={() => deleteTermination.mutate(item.id)}
                  disabled={deleteTermination.isPending}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold disabled:opacity-60"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// ── Complaints ───────────────────────────────────────────────────────────

function ComplaintsSection() {
  const complaints = useMyComplaints();
  const createComplaint = useCreateComplaint();
  const items = complaints.data?.items ?? [];

  const [form, setForm] = useState({ subject_id: "", title: "", description: "" });

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">Complaints</h2>

      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          const subjectId = Number(form.subject_id);
          if (!Number.isFinite(subjectId)) return;
          createComplaint.mutate(
            { subject_id: subjectId, title: form.title, description: form.description },
            { onSuccess: () => setForm({ subject_id: "", title: "", description: "" }) }
          );
        }}
      >
        <input
          type="number"
          placeholder="Concerning (User ID)"
          required
          value={form.subject_id}
          onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <input
          type="text"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <textarea
          placeholder="Description"
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="sm:col-span-2 px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
        <button
          type="submit"
          disabled={createComplaint.isPending}
          className="sm:col-span-2 px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold disabled:opacity-60"
        >
          {createComplaint.isPending ? "Submitting…" : "Submit complaint"}
        </button>
      </form>
      {createComplaint.isError && (
        <div className="mb-4">
          <QueryErrorNotice message={(createComplaint.error as ApiError).message} />
        </div>
      )}

      {complaints.isLoading ? (
        <LoadingSkeleton lines={2} />
      ) : complaints.isError ? (
        <QueryErrorNotice message={(complaints.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No complaints filed.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">{item.title}</span>
              <Badge variant={badgeVariantForStatus(item.status)}>{item.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function EmployeeRequests() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">Requests</h1>
        <p className="text-sm text-gray-400 mt-1">Overtime, termination, and complaint requests.</p>
      </div>
      <OvertimeSection />
      <TerminationSection />
      <ComplaintsSection />
    </div>
  );
}
