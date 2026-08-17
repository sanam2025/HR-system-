import { useState } from "react";
import useAuthStore from "../../../../store/authStore";
import { useTasks, useTask, useStartTask, useSubmitTask } from "../../../../api/hooks/useTasks";
import { useMyEvaluations } from "../../../../api/hooks/useEvaluations";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { ApiError } from "../../../../lib/http/ApiError";

/**
 * The collection documents no status vocabulary beyond what appears in
 * request names ("submitted" as a filter value) and the list this app
 * already renders elsewhere (New / In Progress / Completed / Late). Treated
 * as a heuristic, case-insensitive match rather than a hard enum — a task
 * whose status doesn't match either is shown read-only with no action
 * button, which is the safe default when the real workflow is unclear.
 */
function canStartTask(status: string): boolean {
  return status.trim().toLowerCase() === "new";
}
function canSubmitTask(status: string): boolean {
  return status.trim().toLowerCase() === "in progress";
}

function badgeVariantForStatus(status: string): "default" | "success" | "warning" | "danger" {
  const normalized = status.trim().toLowerCase();
  if (normalized === "completed") return "success";
  if (normalized === "late") return "danger";
  if (normalized === "in progress" || normalized === "submitted") return "warning";
  return "default";
}

function SubmitTaskForm({
  taskId,
  onDone,
}: {
  taskId: number;
  onDone: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const submitTask = useSubmitTask();

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submitTask.mutate(
          { id: taskId, payload: { notes, attachment: attachment ?? undefined } },
          { onSuccess: onDone }
        );
      }}
    >
      <div>
        <label htmlFor="task-notes" className="block text-xs text-gray-500 mb-1">
          Notes
        </label>
        <textarea
          id="task-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
        />
      </div>
      <div>
        <label htmlFor="task-attachment" className="block text-xs text-gray-500 mb-1">
          Attachment (optional)
        </label>
        <input
          id="task-attachment"
          type="file"
          onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-500"
        />
      </div>
      {submitTask.isError && (
        <QueryErrorNotice message={(submitTask.error as ApiError).message} />
      )}
      <button
        type="submit"
        disabled={submitTask.isPending}
        className="px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold disabled:opacity-60"
      >
        {submitTask.isPending ? "Submitting…" : "Submit task"}
      </button>
    </form>
  );
}

function TaskDetailPanel({ taskId }: { taskId: number }) {
  const taskQuery = useTask(taskId);
  const startTask = useStartTask();
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  if (taskQuery.isLoading) return <LoadingSkeleton lines={4} />;
  if (taskQuery.isError) {
    return <QueryErrorNotice message={(taskQuery.error as ApiError).message} />;
  }
  const task = taskQuery.data;
  if (!task) return null;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-dark">{task.title}</h3>
          <p className="text-xs text-gray-400 mt-1">Due {task.dueDate || "—"}</p>
        </div>
        <Badge variant={badgeVariantForStatus(task.status)}>{task.status}</Badge>
      </div>
      <p className="mt-3 text-sm text-gray-500">{task.description ?? "No description available."}</p>

      {startTask.isError && (
        <div className="mt-3">
          <QueryErrorNotice message={(startTask.error as ApiError).message} />
        </div>
      )}

      {canStartTask(task.status) && (
        <button
          type="button"
          onClick={() => startTask.mutate(taskId)}
          disabled={startTask.isPending}
          className="mt-4 px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold disabled:opacity-60"
        >
          {startTask.isPending ? "Starting…" : "Start task"}
        </button>
      )}

      {canSubmitTask(task.status) && !showSubmitForm && (
        <button
          type="button"
          onClick={() => setShowSubmitForm(true)}
          className="mt-4 px-4 py-2 rounded-xl bg-green text-white text-sm font-semibold"
        >
          Submit task
        </button>
      )}
      {canSubmitTask(task.status) && showSubmitForm && (
        <SubmitTaskForm taskId={taskId} onDone={() => setShowSubmitForm(false)} />
      )}
    </div>
  );
}

function MyEvaluationsCard() {
  const evaluations = useMyEvaluations();
  const items = evaluations.data?.items ?? [];

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-50">
      <h2 className="text-sm font-semibold text-dark mb-3">My Performance Evaluations</h2>
      {evaluations.isLoading ? (
        <LoadingSkeleton lines={3} />
      ) : evaluations.isError ? (
        <QueryErrorNotice message={(evaluations.error as ApiError).message} />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">No evaluations yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((evaluation) => (
            <div
              key={evaluation.id}
              className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0"
            >
              <span className="text-dark font-medium">
                {evaluation.period_start} → {evaluation.period_end}
              </span>
              <span className="text-gray-400">
                {evaluation.score !== null ? `Score: ${evaluation.score}` : "Pending"}
              </span>
              <Badge variant="default">{evaluation.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function EmployeeTasks() {
  const userId = useAuthStore((state) => state.user?.id);
  const taskParams = userId ? { user_id: userId } : {};
  const taskQuery = useTasks(taskParams, { enabled: Boolean(userId) });
  const tasks = taskQuery.data?.items ?? [];
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">My Tasks</h1>
        <p className="text-sm text-gray-400 mt-1">Your current tasks are loaded from the authenticated task API.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
          {taskQuery.isLoading && <LoadingSkeleton lines={4} />}
          {taskQuery.isError && (
            <QueryErrorNotice message={(taskQuery.error as ApiError).message} />
          )}
          {!taskQuery.isLoading && !taskQuery.isError && tasks.length === 0 && (
            <p className="text-sm text-gray-500">No tasks assigned yet.</p>
          )}
          {tasks.length > 0 && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-left rounded-3xl border p-4 transition-colors ${
                    selectedTaskId === task.id
                      ? "border-green bg-green-light/40"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-dark">{task.title}</p>
                      <p className="text-xs text-gray-400">Due {task.dueDate || "—"}</p>
                    </div>
                    <Badge variant={badgeVariantForStatus(task.status)}>{task.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          <article className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-50">
            <h2 className="text-sm font-semibold text-dark mb-3">Task Details</h2>
            {selectedTaskId === null ? (
              <p className="text-sm text-gray-400">Select a task to view details.</p>
            ) : (
              <TaskDetailPanel taskId={selectedTaskId} />
            )}
          </article>
          <MyEvaluationsCard />
        </div>
      </div>
    </div>
  );
}
