import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Loader2, User, Trophy, ChevronUp, ChevronDown, ClipboardList, Search, AlertCircle, Briefcase, ChevronRight, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { submitInterviewResult, submitCandidatesRanking, getJobRequisitions } from '../../../api/recruitment';
import apiClient from '../../../api/axios';


// ── Star Rating Widget ──
function StarRating({ value, onChange, max = 5 }: { value: number; onChange?: (v: number) => void; max?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`text-xl transition-all ${star <= (hover || value)
            ? 'text-amber-400 scale-110 drop-shadow-sm'
            : 'text-gray-200 hover:text-amber-300'
            } ${!onChange ? 'cursor-default' : 'cursor-pointer'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const medalEmojis = ['🥇', '🥈', '🥉'];
const medalColors = [
  'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-200',
  'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-200',
  'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-300',
];

// ── Helper: extract full name from any object shape ──
function getFullName(c: any): string {
  if (c?.full_name) return c.full_name;
  if (c?.first_name || c?.last_name) return `${c.first_name || ''} ${c.last_name || ''}`.trim();
  if (c?.name) return c.name;
  if (c?.user?.name) return c.user.name;
  if (c?.candidate?.full_name) return c.candidate.full_name;
  if (c?.candidate?.first_name || c?.candidate?.last_name)
    return `${c.candidate.first_name || ''} ${c.candidate.last_name || ''}`.trim();
  return '—';
}

// ── Helper: normalise interview object so candidate fields are at top level ──
function normalizeInterview(iv: any) {
  if (!iv.candidate) return iv;
  return {
    ...iv,
    full_name: iv.candidate.full_name,
    email: iv.candidate.email,
  };
}

export default function InterviewsPage() {
  const { t, lang } = useLanguage();
  const iv = t.interviews;
  const { jobPostingId: urlJobPostingId } = useParams<{ jobPostingId: string }>();

  // ── Job picker state ──
  const [jobsLoading, setJobsLoading] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(urlJobPostingId ? Number(urlJobPostingId) : null);
  const [mergedJobs, setMergedJobs] = useState<any[]>([]);

  // ── RIGHT panel: pending interviews from my-interviews ──
  const [pendingInterviews, setPendingInterviews] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  // ── LEFT panel: ranked interviews from job-postings/{id}/interviews/ranked-by-rate ──
  const [rankedInterviews, setRankedInterviews] = useState<any[]>([]);
  const [rankedLoading, setRankedLoading] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);

  // ratings applied locally on pending (right panel)
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [order, setOrder] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [rankingSent, setRankingSent] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // ── Effective job posting id ──
  const jobPostingId = urlJobPostingId ? Number(urlJobPostingId) : selectedJobId;

  // ── Fetch job list for picker ──
  useEffect(() => {
    if (urlJobPostingId) return;
    setJobsLoading(true);

    Promise.allSettled([
      apiClient.get('my-interviews'),
      getJobRequisitions(),
      apiClient.get('job-postings'),
    ]).then(([ivResult, reqsResult, postingsResult]) => {
      const interviews: any[] = ivResult.status === 'fulfilled'
        ? (Array.isArray(ivResult.value.data) ? ivResult.value.data : (ivResult.value.data?.data || []))
        : [];

      const reqs: any[] = reqsResult.status === 'fulfilled'
        ? (Array.isArray(reqsResult.value) ? reqsResult.value : (reqsResult.value?.data || []))
        : [];

      const postings: any[] = postingsResult.status === 'fulfilled'
        ? (Array.isArray(postingsResult.value.data) ? postingsResult.value.data : (postingsResult.value.data?.data || []))
        : [];

      const jobMap = new Map<number, any>();

      // from pending interviews
      interviews.forEach((item: any) => {
        const jpId = item.job_posting_id || item.job_posting?.id;
        if (jpId && !jobMap.has(jpId)) {
          const matchedReq = reqs.find((r: any) =>
            r.job_posting_id === jpId ||
            (r.job_title || '').toLowerCase() === (item.job_posting?.title || '').toLowerCase()
          );
          jobMap.set(jpId, {
            id: jpId,
            job_title: item.job_posting?.title || item.job_title || matchedReq?.job_title || `وظيفة #${jpId}`,
            description: item.job_posting?.description || matchedReq?.description || '',
            experience: matchedReq?.experience,
            status: matchedReq?.status || 'approved',
            hasPosting: true,
          });
        }
      });

      // from job-postings list (to include jobs that are posted but have no pending interviews)
      postings.forEach((p: any) => {
        if (!jobMap.has(p.id)) {
          const matchedReq = reqs.find((r: any) =>
            r.job_posting_id === p.id ||
            (r.job_title || '').toLowerCase() === (p.job_title || p.title || '').toLowerCase()
          );
          jobMap.set(p.id, {
            id: p.id,
            job_title: p.job_title || p.title || matchedReq?.job_title || `وظيفة #${p.id}`,
            description: p.description || matchedReq?.description || '',
            experience: matchedReq?.experience,
            status: matchedReq?.status || p.status || 'approved',
            hasPosting: true,
          });
        }
      });

      // remaining unmatched requisitions
      const processedJobs = Array.from(jobMap.values());
      const unmatchedReqs = reqs.filter((r: any) =>
        !processedJobs.some(j => j.job_title.toLowerCase() === (r.job_title || '').toLowerCase())
      ).map((r: any) => {
        const matchedPosting = postings.find((p: any) =>
          (p.job_title || p.title || '').toLowerCase() === (r.job_title || '').toLowerCase()
        );
        return {
          id: matchedPosting ? matchedPosting.id : null,
          job_title: r.job_title || `طلب #${r.id}`,
          description: matchedPosting?.description || r.description || '',
          experience: r.experience,
          status: r.status,
          hasPosting: matchedPosting != null,
        };
      });

      const merged = [...processedJobs, ...unmatchedReqs];
      setMergedJobs(merged);

      const clickable = merged.filter(j => j.hasPosting && j.id != null);
      if (clickable.length === 1 && !selectedJobId) {
        setSelectedJobId(clickable[0].id);
      }
    }).finally(() => setJobsLoading(false));
  }, [urlJobPostingId]);

  // ── Fetch RIGHT panel: my-interviews (pending, to be rated) ──
  useEffect(() => {
    if (!jobPostingId) return;
    setPendingLoading(true);
    setFetchError(null);
    apiClient.get('my-interviews')
      .then(res => {
        const all: any[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        // filter to this job posting
        const forJob = all.filter((item: any) =>
          item.job_posting_id === jobPostingId ||
          item.job_posting?.id === jobPostingId
        );
        const normalized = forJob.map(normalizeInterview);
        setPendingInterviews(normalized);
        setRatings(Object.fromEntries(normalized.map((c: any) => [c.id, c.rate || 0])));
        setOrder(normalized.map((c: any) => c.id));
      })
      .catch(err => {
        const msg = err?.response?.data?.message || (lang === 'ar' ? 'تعذّر تحميل بيانات المقابلات' : 'Failed to load interviews');
        setFetchError(msg);
      })
      .finally(() => setPendingLoading(false));
  }, [jobPostingId, lang]);

  // ── Fetch LEFT panel: ranked-by-rate ──
  useEffect(() => {
    if (!jobPostingId) return;
    setRankedLoading(true);
    apiClient.get(`job-postings/${jobPostingId}/interviews/ranked-by-rate`)
      .then(res => {
        const all: any[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setRankedInterviews(all.map(normalizeInterview));
      })
      .catch(() => setRankedInterviews([]))
      .finally(() => setRankedLoading(false));
  }, [jobPostingId, rankingSent]);

  // ── Filter for search ──
  const filtered = pendingInterviews.filter(c => {
    const name = getFullName(c).toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q);
  });

  const allRated = pendingInterviews.length > 0 && pendingInterviews.every(c => (ratings[c.id] || 0) > 0);

  // ── Ranking order (right panel local sort) ──
  const localRanked = [...pendingInterviews].sort((a, b) => {
    const diff = (ratings[b.id] || 0) - (ratings[a.id] || 0);
    if (diff !== 0) return diff;
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  const moveInOrder = (id: number, dir: -1 | 1) => {
    const score = ratings[id] || 0;
    const sameScoreInOrder = order.filter(oid => (ratings[oid] || 0) === score);
    const pos = sameScoreInOrder.indexOf(id);
    if (dir === -1 && pos === 0) return;
    if (dir === 1 && pos === sameScoreInOrder.length - 1) return;
    const newOrder = [...order];
    const idxA = newOrder.indexOf(id);
    const idxB = newOrder.indexOf(sameScoreInOrder[pos + dir]);
    [newOrder[idxA], newOrder[idxB]] = [newOrder[idxB], newOrder[idxA]];
    setOrder(newOrder);
  };

  const handleSendAll = async () => {
    if (!allRated) { toast.error(iv.toasts.rateFirst); return; }
    setIsSubmittingAll(true);
    try {
      await Promise.all(localRanked.map(c =>
        submitInterviewResult(c.id, { rate: ratings[c.id], notes: 'تم التقييم من النظام' })
      ));
      const rankingPayload = localRanked.map((c, i) => ({ interview_id: c.id, rank: i + 1 }));
      await submitCandidatesRanking(jobPostingId!, { ranking: rankingPayload });
      setRankingSent(true);
      toast.success(iv.toasts.success);
    } catch {
      toast.error(iv.toasts.error);
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const getStatusInfo = (status: string, rating: number) => {
    const effectiveStatus = rating > 0 ? 'done' : (status || 'scheduled');
    const map: Record<string, { label: string; cls: string }> = {
      scheduled: { label: lang === 'ar' ? 'بانتظار المقابلة' : 'Scheduled', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      pending: { label: iv.statusPending, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      done: { label: iv.statusDone, cls: 'bg-green-50 text-green-700 border-green-200' },
      rejected: { label: iv.statusRejected, cls: 'bg-red-50 text-red-600 border-red-200' },
    };
    return map[effectiveStatus] || map.scheduled;
  };

  // ── Job Picker screen ──
  if (!jobPostingId) return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
          <Briefcase size={22} className="text-green" />
          {lang === 'ar' ? 'إدارة المقابلات' : 'Manage Interviews'}
        </h2>
        <p className="text-sm text-brown mt-1">{lang === 'ar' ? 'اختر الوظيفة لعرض مرشحيها' : 'Select a job posting to view its candidates'}</p>
      </div>

      {jobsLoading ? (
        <div className="flex items-center justify-center py-20 text-green">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : mergedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 shadow-card">
          <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === 'ar' ? 'لا توجد وظائف متاحة حالياً' : 'No job postings available'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mergedJobs.map((job: any, idx: number) => {
            const canClick = job.hasPosting && job.id != null;
            return (
              <button
                key={job.id ?? `req-${idx}`}
                disabled={!canClick}
                onClick={() => canClick && setSelectedJobId(job.id)}
                className={`rounded-2xl border p-5 text-start transition-all group ${
                  canClick
                    ? 'bg-white border-gray-100 shadow-card hover:border-green hover:shadow-md cursor-pointer'
                    : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    canClick ? 'bg-green/10 group-hover:bg-green/20' : 'bg-gray-200'
                  }`}>
                    <Briefcase size={18} className={canClick ? 'text-green' : 'text-gray-400'} />
                  </div>
                  {canClick
                    ? <ChevronRight size={18} className="text-gray-300 group-hover:text-green transition-colors mt-1 flex-shrink-0" />
                    : <span className="text-[10px] text-gray-400 font-semibold mt-1 text-end leading-tight">{lang === 'ar' ? 'في انتظار\nالنشر من HR' : 'Pending\nHR publish'}</span>
                  }
                </div>
                <h3 className="font-bold text-dark mt-3 text-sm">{job.job_title}</h3>
                <p className="text-xs text-brown mt-1">{job.description ? job.description.slice(0, 60) + '...' : ''}</p>
                <div className="mt-3 flex items-center flex-wrap gap-2">
                  {canClick ? (
                    <span className="bg-green/10 text-green text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {lang === 'ar' ? `وظيفة #${job.id}` : `Job #${job.id}`}
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {lang === 'ar' ? 'بانتظار النشر' : 'Not published yet'}
                    </span>
                  )}
                  {job.status && (
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      job.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      job.status === 'pending'  ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {job.status === 'approved' ? (lang === 'ar' ? 'معتمد' : 'Approved') :
                       job.status === 'pending'  ? (lang === 'ar' ? 'قيد المراجعة' : 'Pending') : job.status}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (fetchError) return (
    <div className="flex flex-col items-center justify-center py-32 text-red-500 gap-4">
      <AlertCircle size={48} className="opacity-60" />
      <p className="font-bold text-lg text-center max-w-sm">{fetchError}</p>
      {!urlJobPostingId && (
        <button onClick={() => setSelectedJobId(null)} className="text-sm text-green underline font-semibold">
          {lang === 'ar' ? 'اختر وظيفة أخرى' : 'Choose another job'}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* ── Job indicator + change button ── */}
      {!urlJobPostingId && (
        <div className="flex items-center gap-3 bg-green/5 border border-green/20 rounded-xl px-4 py-3">
          <Briefcase size={16} className="text-green" />
          <span className="text-sm font-semibold text-green flex-1">
            {(() => {
              const job = mergedJobs.find(j => j.id === jobPostingId);
              return job?.job_title || (lang === 'ar' ? `وظيفة #${jobPostingId}` : `Job #${jobPostingId}`);
            })()}
          </span>
          <button
            onClick={() => { setSelectedJobId(null); setPendingInterviews([]); setRankedInterviews([]); setRankingSent(false); }}
            className="text-xs text-green underline font-semibold"
          >
            {lang === 'ar' ? 'تغيير الوظيفة' : 'Change Job'}
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
            <ClipboardList size={22} className="text-green" />
            {iv.title}
          </h2>
          <p className="text-sm text-brown mt-1">
            {pendingInterviews.length} {iv.candidatesCount} · {pendingInterviews.filter(c => (ratings[c.id] || 0) > 0).length} {iv.ratedCount}
          </p>
        </div>

        <button
          onClick={handleSendAll}
          disabled={!allRated || isSubmittingAll || rankingSent}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${allRated && !rankingSent
            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isSubmittingAll ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          {rankingSent ? iv.rankingSent : isSubmittingAll ? iv.sendingRanking : iv.sendRanking}
        </button>
      </div>

      {pendingInterviews.length > 0 && !allRated && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-amber-700 text-sm font-medium">
          ⚠️ {iv.rateAllWarning}
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── LEFT: Pending Evaluation Panel (from my-interviews) ── */}
        <div className="xl:col-span-3 space-y-4">

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green transition-colors bg-white"
              placeholder={iv.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {pendingLoading ? (
            <div className="flex items-center justify-center py-16 text-green">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <User size={40} className="mx-auto mb-3 opacity-30" />
              <p>{pendingInterviews.length === 0
                ? (lang === 'ar' ? 'لا توجد مقابلات معلقة لهذه الوظيفة' : 'No pending interviews for this job')
                : iv.noResults}
              </p>
            </div>
          ) : (
            filtered.map(c => {
              const rating = ratings[c.id] || 0;
              const isSelected = selectedCandidate?.id === c.id;
              const name = getFullName(c);
              const statusInfo = getStatusInfo(c.status, rating);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(isSelected ? null : c)}
                  className={`bg-white rounded-2xl border shadow-card p-5 cursor-pointer transition-all hover:shadow-card-hover ${isSelected ? 'border-green ring-2 ring-green/20' : 'border-gray-100'}`}
                >
                  {/* Top Row */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green/20 to-green/10 flex items-center justify-center text-green font-extrabold text-lg flex-shrink-0">
                      {name[0]?.toUpperCase() || '?'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-dark">{name}</p>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      {c.email && (
                        <p className="text-xs text-gray-400 mt-0.5">{c.email}</p>
                      )}
                      {c.scheduled_at && (
                        <p className="text-xs text-brown mt-0.5">
                          📅 {new Date(c.scheduled_at).toLocaleDateString(lang === 'ar' ? 'ar-SY' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating Row */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-brown font-semibold mb-1.5">{iv.interviewRating}</p>
                      <StarRating
                        value={rating}
                        onChange={v => setRatings(prev => ({ ...prev, [c.id]: v }))}
                      />
                    </div>
                    {rating === 0 ? (
                      <span className="text-xs text-gray-400 italic">{iv.notRatedYet}</span>
                    ) : (
                      <span className="text-2xl font-extrabold text-amber-500">{rating}<span className="text-sm text-gray-400">/5</span></span>
                    )}
                  </div>

                  {/* Notes (expanded) */}
                  {isSelected && c.notes && (
                    <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 text-sm text-brown border border-gray-100">
                      <span className="font-semibold text-dark">{iv.notes}: </span>{c.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── RIGHT: Ranked Panel (from ranked-by-rate) ── */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-amber-500" />
              <h3 className="font-bold text-dark">{iv.rankingPanel}</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-5">{iv.rankingSubtitle}</p>

            {rankedLoading ? (
              <div className="flex items-center justify-center py-10 text-green">
                <Loader2 className="animate-spin" size={28} />
              </div>
            ) : rankedInterviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Trophy size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs">{lang === 'ar' ? 'لا يوجد ترتيب بعد' : 'No ranking yet'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rankedInterviews.map((c, i) => {
                  const name = getFullName(c);
                  const score = c.rate || 0;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === 0 && score > 0
                        ? 'bg-amber-50 border border-amber-100'
                        : 'bg-gray-50 border border-transparent'
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${i < 3 && score > 0 ? medalColors[i] : 'bg-gray-200 text-gray-500'}`}>
                        {i < 3 && score > 0 ? medalEmojis[i] : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-dark truncate">{name}</p>
                        <StarRating value={score} max={5} />
                      </div>
                      <span className={`text-sm font-extrabold w-8 text-end ${score > 0
                        ? i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-500' : i === 2 ? 'text-amber-700' : 'text-dark'
                        : 'text-gray-300'
                        }`}>
                        {score > 0 ? `${score}/5` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {rankingSent && (
              <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-semibold text-center">
                {iv.rankingDone}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
