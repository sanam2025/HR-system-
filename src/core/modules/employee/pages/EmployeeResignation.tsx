import { useState } from "react";
import type { FormEvent } from "react";
import { LogOut, FileText, UploadCloud, FileIcon, X } from "lucide-react";
import { Badge, LoadingSkeleton, QueryErrorNotice } from "../components/commend-components";
import { useCreateResignation, useMyResignations } from "../../../../api/hooks/useResignations";
import { ApiError } from "../../../../lib/http/ApiError";
import { useLanguage } from "../../../../i18n/translations/LanguageContext";
import { humanizeStatus } from "../../../../lib/text";

function statusVariant(status?: string): "success" | "warning" | "danger" | "default" {
  const normalized = (status ?? "").toLowerCase();
  if (normalized === "approved") return "success";
  if (normalized === "pending" || normalized === "under_review") return "warning";
  if (normalized === "rejected") return "danger";
  return "default";
}

export default function EmployeeResignation() {
  const { t, isRTL } = useLanguage();
  const myResignations = useMyResignations();
  const createResignation = useCreateResignation();

  const [type, setType] = useState<"immediate" | "with_notice">("with_notice");
  const [reason, setReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!type || !reason) return;
    setSuccessMessage(null);

    createResignation.mutate({ type, reason }, {
      onSuccess: () => {
        setSuccessMessage(isRTL ? "تم إرسال طلب الاستقالة بنجاح." : "Resignation request submitted successfully.");
        setReason("");
      },
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="min-w-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-dark">
          {isRTL ? "الاستقالة" : "Resignation"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isRTL ? "تقديم طلب الاستقالة ومتابعة حالته." : "Submit your resignation request and track its status."}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-200 relative overflow-hidden transition-all h-fit">
          <div className="absolute top-0 start-0 w-2 h-full bg-green" />
          <header className="flex items-center gap-3 text-green font-bold text-xl mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-green/15 rounded-xl text-green">
              <LogOut size={24} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span>{isRTL ? "تقديم طلب استقالة" : "Submit Resignation"}</span>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {createResignation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                {(createResignation.error as ApiError).message}
              </div>
            )}
            {successMessage && (
              <div className="bg-green/10 border border-green/30 text-green px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
                {successMessage}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {isRTL ? "نوع الاستقالة" : "Resignation Type"}
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 relative">
                    <input 
                      type="radio" 
                      name="resignation_type" 
                      value="with_notice" 
                      checked={type === "with_notice"} 
                      onChange={() => setType("with_notice")} 
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-2xl border-2 border-gray-200 text-center cursor-pointer transition-all peer-checked:border-green peer-checked:bg-green/5 hover:bg-gray-50">
                      <p className="font-bold text-sm text-gray-900 peer-checked:text-green">
                        {isRTL ? "مع فترة إنذار" : "With Notice"}
                      </p>
                    </div>
                  </label>
                  <label className="flex-1 relative">
                    <input 
                      type="radio" 
                      name="resignation_type" 
                      value="immediate" 
                      checked={type === "immediate"} 
                      onChange={() => setType("immediate")} 
                      className="peer sr-only"
                    />
                    <div className="p-4 rounded-2xl border-2 border-gray-200 text-center cursor-pointer transition-all peer-checked:border-green peer-checked:bg-green/5 hover:bg-gray-50">
                      <p className="font-bold text-sm text-gray-900 peer-checked:text-green">
                        {isRTL ? "فوري" : "Immediate"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="resignation-reason" className="block text-xs font-bold text-gray-700 mb-2">
                  {isRTL ? "سبب الاستقالة" : "Reason"}
                </label>
                <textarea
                  id="resignation-reason"
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={isRTL ? "يرجى توضيح سبب الاستقالة..." : "Please describe the reason..."}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-300 text-sm font-bold text-gray-900 bg-gray-50/80 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-green/20 focus:border-green transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createResignation.isPending || !reason}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green text-white rounded-2xl text-base font-bold shadow-lg shadow-green/30 hover:bg-green/90 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:transform-none"
            >
              <LogOut size={18} />
              {createResignation.isPending 
                ? (isRTL ? "جاري الإرسال..." : "Submitting...") 
                : (isRTL ? "تأكيد الاستقالة" : "Submit Resignation")}
            </button>
          </form>
        </article>
        <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-200 h-fit relative overflow-hidden">
          <div className="absolute top-0 start-0 w-2 h-full bg-gray-400" />
          <header className="flex items-center gap-3 text-gray-800 font-bold text-xl mb-6 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-gray-200 rounded-xl text-gray-700">
              <FileText size={24} aria-hidden="true" strokeWidth={2.5} />
            </div>
            <span>{isRTL ? "استقالاتي" : "My Resignations"}</span>
          </header>

          {myResignations.isLoading ? (
            <LoadingSkeleton lines={4} />
          ) : myResignations.isError ? (
            <QueryErrorNotice message={(myResignations.error as ApiError).message} />
          ) : !myResignations.data || myResignations.data.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
               <FileText className="mx-auto text-gray-400 mb-3" size={48} strokeWidth={1.5} />
               <p className="text-sm font-bold text-gray-500">
                 {isRTL ? "لم تقم بتقديم أي طلب استقالة." : "You haven't filed any resignations yet."}
               </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myResignations.data.map((resignation) => (
                <div key={resignation.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-base font-bold text-gray-900 leading-tight group-hover:text-green transition-colors break-words min-w-0">
                      {isRTL && resignation.type === "with_notice" ? "مع فترة إنذار" : 
                       isRTL && resignation.type === "immediate" ? "فوري" : 
                       resignation.type}
                    </p>
                    {resignation.status && (
                      <div className="flex-shrink-0">
                         <Badge variant={statusVariant(resignation.status)}>{humanizeStatus(resignation.status)}</Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 bg-white p-4 rounded-xl border border-gray-200 whitespace-pre-wrap break-words shadow-sm">
                    {resignation.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
