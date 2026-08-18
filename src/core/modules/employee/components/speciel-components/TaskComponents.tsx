import { useState } from "react";
import type { FormEvent } from "react";
import { ClipboardList, Play, Send } from "lucide-react";
import { Badge, LoadingSkeleton } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import type { SubmitTaskPayload, Task } from "../../../../../api/models";

function taskDueDate(task: Task): string {
  return task.due_date || task.dueDate || "—";
}

function taskStatusVariant(status: string): "success" | "warning" | "danger" | "default" {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "approved") return "success";
  if (normalized === "in_progress" || normalized === "submitted" || normalized === "pending") return "warning";
  if (normalized === "rejected" || normalized === "cancelled") return "danger";
  return "default";
}

function canStart(status: string): boolean {
  return status.toLowerCase() === "pending";
}

function canSubmit(status: string): boolean {
  return status.toLowerCase() === "in_progress";
}

function SubmitTaskForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  onCancel,
}: {
  onSubmit: (payload: SubmitTaskPayload) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notes) return;
    onSubmit({ notes, ...(attachment ? { attachment } : {}) });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-xl bg-gray-50 p-3">
      {errorMessage && (
        <p role="alert" className="text-xs text-red-600">
          {errorMessage}
        </p>
      )}
      <textarea
        required
        placeholder="Submission notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        rows={2}
      />
      <input
        type="file"
        onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
        className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-lg file:border-0 file:bg-green-light file:text-green-dark file:text-xs"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green text-white rounded-xl text-xs font-medium hover:bg-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send size={12} />
          {isSubmitting ? "Submitting…" : "Submit for review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export interface TaskListCardProps {
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  onStart: (id: number) => void;
  startingId?: number | null;
  onSubmit: (id: number, payload: SubmitTaskPayload) => void;
  submittingId?: number | null;
  submitError?: string | null;
  startError?: string | null;
}

export function TaskListCard({
  tasks,
  isLoading,
  isError,
  onStart,
  startingId,
  onSubmit,
  submittingId,
  submitError,
  startError,
}: TaskListCardProps) {
  const [openSubmitFor, setOpenSubmitFor] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <ClipboardList size={16} aria-hidden="true" />
        <span>My Tasks</span>
      </header>

      {isLoading && <LoadingSkeleton lines={4} />}
      {isError && <p className="text-sm text-red-500">Unable to load tasks. Please refresh or try again later.</p>}
      {startError && (
        <p role="alert" className="text-sm text-red-600 mb-3">
          {startError}
        </p>
      )}
      {!isLoading && !isError && tasks.length === 0 && (
        <p className="text-sm text-gray-500">No tasks assigned yet.</p>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => {
            const status = String(task.status);
            return (
              <div key={task.id} className="rounded-3xl border border-gray-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">Due {taskDueDate(task)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={taskStatusVariant(status)}>{humanizeStatus(status)}</Badge>
                    {task.is_overdue && <Badge variant="danger">Overdue</Badge>}
                    {canStart(status) && (
                      <button
                        type="button"
                        onClick={() => onStart(task.id)}
                        disabled={startingId === task.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green text-white rounded-xl text-xs font-medium hover:bg-green-dark transition-colors disabled:opacity-60"
                      >
                        <Play size={12} />
                        {startingId === task.id ? "Starting…" : "Start"}
                      </button>
                    )}
                    {canSubmit(status) && openSubmitFor !== task.id && (
                      <button
                        type="button"
                        onClick={() => setOpenSubmitFor(task.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-beige text-green border border-green rounded-xl text-xs font-medium hover:bg-beige-dark transition-colors"
                      >
                        <Send size={12} />
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  {task.description ?? "No description available."}
                </div>
                {openSubmitFor === task.id && (
                  <SubmitTaskForm
                    isSubmitting={submittingId === task.id}
                    errorMessage={submittingId === task.id ? submitError : null}
                    onCancel={() => setOpenSubmitFor(null)}
                    onSubmit={(payload) => {
                      onSubmit(task.id, payload);
                      setOpenSubmitFor(null);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TaskStatusSummaryCard({ tasks }: { tasks: Task[] }) {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      const status = String(task.status ?? "Unknown");
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks yet.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {tasks.length} task{tasks.length === 1 ? "" : "s"}.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
              <div key={status} className="rounded-2xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-gray-500">{humanizeStatus(status)}</p>
                <p className="mt-2 text-2xl font-semibold text-dark">{count}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
