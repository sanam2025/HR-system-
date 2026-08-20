import { useState } from "react";
import type { FormEvent } from "react";
import { ClipboardList, Play, Send, Paperclip, FileText, X, Calendar, Star, Award, CheckCircle, Clock, Activity, CheckSquare } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="mt-4 space-y-5 rounded-2xl bg-gray-50/80 border-2 border-gray-200 p-6 shadow-sm animate-fade-in text-right">
      <h4 className="text-sm font-bold text-[#4A7C59] flex items-center justify-end gap-2 mb-4">
        Submit Task - تسليم المهمة
        <Send size={18} className="transform -scale-x-100" />
      </h4>
      {errorMessage && (
        <div role="alert" className="text-sm font-bold text-red-700 bg-red-100 p-3 rounded-xl border-2 border-red-200">
          {errorMessage}
        </div>
      )}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Notes - الملاحظات
        </label>
        <textarea
          required
          placeholder="Briefly describe the outcome... - صف بإيجاز ما تم إنجازه..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-bold placeholder-gray-500 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-all resize-none text-right"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Attachment (Optional) - مرفق (اختياري)
        </label>
        <div className="bg-white border-2 border-gray-300 rounded-xl p-1.5 shadow-sm overflow-hidden">
          {!attachment ? (
            <div className="relative w-full">
              <input
                type="file"
                onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-row-reverse items-center justify-end gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg border-2 border-dashed border-gray-400">
                <Paperclip size={18} className="text-gray-700" />
                <span className="text-sm font-bold text-gray-800">Choose File - اختر ملف</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-row-reverse items-center justify-between w-full px-4 py-3 bg-[#4A7C59]/10 rounded-lg border-2 border-[#4A7C59]/30">
              <div className="flex flex-row-reverse items-center gap-3 overflow-hidden">
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
      <div className="flex flex-row-reverse items-center justify-between gap-3 pt-4 border-t-2 border-gray-200 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Cancel - إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4A7C59] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#3d6649] hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting… - جاري الإرسال" : "Submit for review - إرسال للمراجعة"}
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
        <span>My Tasks - المهام</span>
      </header>

      {isLoading && <LoadingSkeleton lines={4} />}
      {isError && <p className="text-sm text-red-500">Unable to load tasks. Please refresh or try again later - تعذر تحميل المهام.</p>}
      {startError && (
        <p role="alert" className="text-sm text-red-600 mb-3">
          {startError}
        </p>
      )}
      {!isLoading && !isError && tasks.length === 0 && (
        <p className="text-sm text-gray-500">No tasks assigned yet - لم يتم تعيين مهام بعد.</p>
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
                      <div className="flex flex-wrap items-center justify-end sm:justify-start gap-2 text-sm font-medium text-gray-500">
                        <Badge variant={taskStatusVariant(status)}>{humanizeStatus(status)}</Badge>
                        <span className="text-gray-300 hidden sm:inline">|</span>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100" dir="ltr">
                          <Calendar size={14} className="text-gray-400" />
                          <span>Due {taskDueDate(task)}</span>
                        </div>
                        {task.is_overdue && <Badge variant="danger">Overdue</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body: Description */}
                <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 relative z-10 text-right">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description - الوصف</h4>
                  <p className="text-sm text-gray-500 leading-relaxed pr-11">
                    {task.description ?? "No description available - لا يوجد وصف متاح."}
                  </p>

                  {/* Evaluation Block */}
                  {(task.score != null || task.latest_submission?.review?.score != null) && (
                    <div className="mt-5">
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#4A7C59]/10 via-[#4A7C59]/5 to-transparent border border-[#4A7C59]/20 p-5">
                        {/* Decorative Icon Background */}
                        <div className="absolute -top-4 -right-2 text-[#4A7C59]/10 pointer-events-none transform -rotate-12">
                          <Award size={100} />
                        </div>
                        
                        <div className="relative z-10 flex flex-col gap-3 text-right">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/30 flex-shrink-0">
                              <Star size={24} className="fill-white" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-xs font-bold text-[#4A7C59]/80 uppercase tracking-wider mb-1">Final Score - التقييم النهائي</h5>
                              <div className="flex items-baseline justify-start gap-1 flex-row-reverse" dir="ltr">
                                <span className="text-2xl font-black text-[#4A7C59] leading-none">
                                  {task.score ?? task.latest_submission?.review?.score}
                                </span>
                                <span className="text-sm font-bold text-gray-400">/ 100</span>
                              </div>
                            </div>
                          </div>

                          {task.latest_submission?.review?.comment && (
                            <div className="mt-2 mr-14 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm relative">
                              <div className="absolute top-0 right-0 w-1 h-full bg-[#4A7C59]/40 rounded-r-xl" />
                              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500">
                                <FileText size={14} />
                                <span>Reviewer Notes - ملاحظات المراجع</span>
                              </div>
                              <p className="text-sm text-gray-700 italic font-medium">
                                "{task.latest_submission.review.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                      <Play size={16} fill="currentColor" />
                      {startingId === task.id ? "Starting… - جاري البدء" : "Start Task - بدء المهمة"}
                    </button>
                  )}
                  {canSubmit(status) && openSubmitFor !== task.id && (
                    <button
                      type="button"
                      onClick={() => setOpenSubmitFor(task.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#4A7C59] border-2 border-[#4A7C59] rounded-xl text-sm font-bold hover:bg-[#4A7C59]/5 hover:-translate-y-0.5 transition-all shadow-sm"
                    >
                      <Send size={16} />
                      Submit Task - تسليم المهمة
                    </button>
                  )}
                </div>

                {openSubmitFor === task.id && (
                  <div className="relative z-10 pt-4 mt-2 border-t border-gray-100 text-right">
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
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Pending - قيد الانتظار</p>
      </div>

      {/* In Progress */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-blue-400"></div>
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Activity size={24} />
        </div>
        <h3 className="text-3xl font-black text-blue-700 leading-none mb-1">{inProgress}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-blue-500/80 uppercase tracking-widest">In Progress - قيد التنفيذ</p>
      </div>

      {/* Submitted */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-purple-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-purple-400"></div>
        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <Send size={24} />
        </div>
        <h3 className="text-3xl font-black text-purple-700 leading-none mb-1">{submitted}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-purple-500/80 uppercase tracking-widest">Submitted - تم التسليم</p>
      </div>

      {/* Approved / Completed */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-green-50 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-green-500"></div>
        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform">
          <CheckSquare size={24} />
        </div>
        <h3 className="text-3xl font-black text-green-700 leading-none mb-1">{approved}</h3>
        <p className="text-[10px] sm:text-xs font-bold text-green-500/80 uppercase tracking-widest">Approved - مكتملة</p>
      </div>
    </div>
  );
}
