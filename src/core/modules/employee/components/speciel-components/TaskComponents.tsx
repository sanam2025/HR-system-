import { useState } from "react";
import type { FormEvent } from "react";
import { ClipboardList, Play, Send, Paperclip, FileText, X, Calendar, Star, Award, CheckCircle, Clock, Activity, CheckSquare, Loader2 } from "lucide-react";
import { Badge, LoadingSkeleton } from "../commend-components";
import { humanizeStatus } from "../../../../../lib/text";
import { useLanguage } from "../../../../../i18n/translations/LanguageContext";
import type { SubmitTaskPayload, Task } from "../../../../../api/models";
import { useTask } from "../../../../../api/hooks/useTasks";

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

function TaskFeedbackContent({ taskId }: { taskId: number }) {
  const { t, isRTL } = useLanguage();
  const { data: task, isLoading } = useTask(taskId);

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center py-2">
        <Loader2 className="animate-spin text-gray-400" size={16} />
      </div>
    );
  }

  if (!task) return null;

  const comment = task.comment || task.latest_submission?.comment || task.latest_submission?.review?.comment;

  if (!comment) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="mt-2 rtl:mr-14 ltr:ml-14 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm relative">
        <div className="absolute top-0 rtl:right-0 ltr:left-0 w-1 h-full bg-[#4A7C59]/40 rtl:rounded-r-xl ltr:rounded-l-xl" />
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500">
          <FileText size={14} />
          <span>{t.tasks?.reviewerNotes || "Reviewer Notes"}</span>
        </div>
        <p className="text-sm text-gray-700 italic font-medium">
          "{comment}"
        </p>
      </div>
    </div>
  );
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
  const { t } = useLanguage();
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notes) return;
    onSubmit({ notes, ...(attachment ? { attachment } : {}) });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5 rounded-2xl bg-gray-50/80 border-2 border-gray-200 p-6 shadow-sm animate-fade-in text-right">
      <h4 className="text-sm font-bold text-[#4A7C59] flex items-center justify-end gap-2 mb-4">
        {t.tasks?.submitTask || "Submit Task"}
        <Send size={18} className="transform rtl:rotate-180" />
      </h4>
      {errorMessage && (
        <div role="alert" className="text-sm font-bold text-red-700 bg-red-100 p-3 rounded-xl border-2 border-red-200">
          {errorMessage}
        </div>
      )}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2 rtl:text-right ltr:text-left">
          {t.tasks?.notes || "Notes"}
        </label>
        <textarea
          required
          placeholder={t.tasks?.notesPlaceholder || "Briefly describe the outcome..."}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold placeholder-gray-500 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all resize-none rtl:text-right ltr:text-left"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2 rtl:text-right ltr:text-left">
          {t.tasks?.attachment || "Attachment (Optional)"}
        </label>
        <div className="bg-white border-2 border-gray-300 rounded-xl p-1.5 shadow-sm overflow-hidden">
          {!attachment ? (
            <div className="relative w-full">
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex rtl:flex-row-reverse ltr:flex-row items-center justify-end gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg border-2 border-dashed border-gray-400">
                <Paperclip size={18} className="text-gray-700" />
                <span className="text-sm font-bold text-gray-800">{t.tasks?.chooseFile || "Choose File"}</span>
              </div>
            </div>
          ) : (
            <div className="flex rtl:flex-row-reverse ltr:flex-row items-center justify-between w-full px-4 py-3 bg-[#4A7C59]/10 rounded-lg border-2 border-[#4A7C59]/30">
              <div className="flex rtl:flex-row-reverse ltr:flex-row items-center gap-3 overflow-hidden">
                <FileText size={20} className="text-[#4A7C59] flex-shrink-0" />
                <span className="text-sm font-bold text-gray-900 truncate" dir="ltr">
                  {attachment.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 font-bold"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex rtl:flex-row-reverse ltr:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-gray-200 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {t.tasks?.cancel || "Cancel"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#3d6649] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.tasks?.submitting || "Submitting..." : t.tasks?.submitForReview || "Submit for review"}
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
  const { t } = useLanguage();
  const [openSubmitFor, setOpenSubmitFor] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
      <header className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <ClipboardList size={16} aria-hidden="true" />
        <span>{t.tasks?.myTasks || "My Tasks"}</span>
      </header>

      {isLoading && <LoadingSkeleton lines={4} />}
      {isError && <p className="text-sm text-red-500">{t.tasks?.loadError || "Unable to load tasks. Please refresh or try again later."}</p>}
      {startError && (
        <p role="alert" className="text-sm text-red-600 mb-3">
          {startError}
        </p>
      )}
      {!isLoading && !isError && tasks.length === 0 && (
        <p className="text-sm text-gray-500">{t.tasks?.emptyTasks || "No tasks assigned yet."}</p>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <div className="space-y-4">
          {tasks.map((task) => {
            const status = String(task.status);
            return (
              <div
                key={task.id}
                className="group relative p-6 rounded-3xl border border-gray-200 hover:border-[#4A7C59]/40 shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col gap-5 overflow-hidden"
              >
                {/* Status Indicator Stripe */}
                <div className={`absolute top-0 bottom-0 right-0 w-1.5 ${
                  status.toLowerCase() === "completed" || status.toLowerCase() === "approved" ? "bg-green-500" :
                  status.toLowerCase() === "rejected" || status.toLowerCase() === "cancelled" ? "bg-red-500" :
                  "bg-yellow-400"
                }`} />

                {/* Header: Title and Meta */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10 pr-2">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-10 h-10 rounded-full bg-[#4A7C59]/10 text-[#4A7C59] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ClipboardList size={20} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">{task.title}</h3>
                      <div className="flex flex-wrap items-center rtl:justify-start ltr:justify-start gap-2 text-sm font-medium text-gray-500">
                        <Badge variant={taskStatusVariant(status)}>{humanizeStatus(status)}</Badge>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100" dir="ltr">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{t.tasks?.due || "Due"} {taskDueDate(task)}</span>
                        </div>
                        {task.is_overdue && <Badge variant="danger">{t.tasks?.overdue || "Overdue"}</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body: Description */}
                <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 relative z-10 rtl:text-right ltr:text-left">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t.tasks?.description || "Description"}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed rtl:pr-11 ltr:pl-11">
                    {task.description ?? t.tasks?.emptyDescription ?? "No description available."}
                  </p>

                  {/* Evaluation Block */}
                  {(task.score != null) && (
                    <div className="mt-5">
                      <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 relative overflow-hidden flex items-center justify-between">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full blur-2xl opacity-60" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Star size={20} className="fill-current" />
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-0.5">{t.tasks?.finalScore || "FINAL SCORE"}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-green-700 leading-none">{Number(task.score).toFixed(2)}</span>
                              <span className="text-sm font-bold text-gray-400">/ 100</span>
                            </div>
                          </div>
                        </div>
                        
                        <Award size={48} className="text-green-500/10 absolute -left-2 -bottom-2 z-0 transform -rotate-12" />
                      </div>
                    </div>
                  )}

                  {/* Submission and Feedback Details */}
                  {['submitted', 'approved', 'rejected', 'completed'].includes((task.status || '').toLowerCase()) && (
                    <TaskFeedbackContent taskId={task.id} />
                  )}
                </div>

                {/* Footer: Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 relative z-10">
                  {canStart(status) && (
                    <button
                      type="button"
                      onClick={() => onStart(task.id)}
                      disabled={startingId === task.id}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-bold shadow-md hover:bg-opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none"
                    >
                      <Play size={16} fill="currentColor" className="rtl:rotate-180" />
                      {startingId === task.id ? t.tasks?.starting || "Starting..." : t.tasks?.startTask || "Start Task"}
                    </button>
                  )}
                  {canSubmit(status) && openSubmitFor !== task.id && (
                    <button
                      type="button"
                      onClick={() => setOpenSubmitFor(task.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#4A7C59] border-2 border-[#4A7C59] rounded-xl text-sm font-bold hover:bg-[#4A7C59]/5 hover:-translate-y-0.5 transition-all shadow-sm"
                    >
                      <Send size={16} className="rtl:rotate-180" />
                      {t.tasks?.submitTask || "Submit Task"}
                    </button>
                  )}
                </div>

                {openSubmitFor === task.id && (
                  <div className="relative z-10 pt-4 mt-2 border-t border-gray-100 rtl:text-right ltr:text-left">
                    <SubmitTaskForm
                      onSubmit={(payload) => {
                        onSubmit(task.id, payload);
                        setOpenSubmitFor(null);
                      }}
                      isSubmitting={submittingId === task.id}
                      errorMessage={submittingId === task.id ? submitError : null}
                      onCancel={() => setOpenSubmitFor(null)}
                    />
                  </div>
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
  const { t } = useLanguage();
  const pending = tasks.filter(t => String(t.status).toLowerCase() === "pending").length;
  const inProgress = tasks.filter(t => String(t.status).toLowerCase() === "in_progress").length;
  const submitted = tasks.filter(t => String(t.status).toLowerCase() === "submitted").length;
  const approved = tasks.filter(t => String(t.status).toLowerCase() === "approved" || String(t.status).toLowerCase() === "completed").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-2">
      {/* Pending */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-gray-200"></div>
        <div className="w-12 h-12 bg-gray-50 text-gray-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Clock size={24} />
        </div>
        <h3 className="text-3xl font-black text-gray-800 leading-none mb-1">{pending}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">{t.tasks?.pending || "Pending"}</p>
      </div>

      {/* In Progress */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-blue-400"></div>
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Activity size={24} />
        </div>
        <h3 className="text-3xl font-black text-blue-700 leading-none mb-1">{inProgress}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-blue-500/80 uppercase tracking-widest">{t.tasks?.inProgress || "In Progress"}</p>
      </div>

      {/* Submitted */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-purple-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-purple-400"></div>
        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Send size={24} className="rtl:rotate-180" />
        </div>
        <h3 className="text-3xl font-black text-purple-700 leading-none mb-1">{submitted}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-purple-500/80 uppercase tracking-widest">{t.tasks?.submitted || "Submitted"}</p>
      </div>

      {/* Approved / Completed */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-green-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-green-500"></div>
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <CheckSquare size={24} />
        </div>
        <h3 className="text-3xl font-black text-green-700 leading-none mb-1">{approved}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-green-500/80 uppercase tracking-widest">{t.tasks?.approved || "Approved"}</p>
      </div>
    </div>
  );
}
