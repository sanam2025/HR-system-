import { useState, useEffect } from 'react';
import { Star, Send, Loader2, User, Trophy, ChevronUp, ChevronDown, ClipboardList, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { getInterviewCandidates, submitInterviewResult, submitCandidatesRanking } from '../../../api/recruitment';

// ── Mock fallback data ──
const MOCK_CANDIDATES = [
  { id: 1, name: 'رامي حسن خليل', position: 'مطور React', experience: 4, skills: ['React', 'TypeScript', 'Node.js'], cvScore: 80, notes: 'خبرة جيدة في المشاريع الكبيرة', status: 'pending' },
  { id: 2, name: 'دانا سليم أحمد', position: 'مطور React', experience: 2, skills: ['React', 'CSS', 'JavaScript'], cvScore: 75, notes: 'مبادرة عالية وتعلم سريع', status: 'pending' },
  { id: 3, name: 'باسم عادل عمر', position: 'مطور React', experience: 6, skills: ['React', 'Redux', 'GraphQL'], cvScore: 88, notes: 'خبرة واسعة ومهارات قيادية', status: 'pending' },
  { id: 4, name: 'هنا محمد فاضل', position: 'مطور React', experience: 3, skills: ['React', 'Vue', 'Tailwind'], cvScore: 70, notes: 'تصميم ممتاز وانتباه للتفاصيل', status: 'pending' },
];

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

export default function InterviewsPage() {
  const { t, lang } = useLanguage();
  const iv = t.interviews;

  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [order, setOrder] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [rankingSent, setRankingSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getInterviewCandidates(4);
        const items = Array.isArray(data) ? data : (data?.data || []);
        if (items.length > 0) {
          setCandidates(items);
          setRatings(Object.fromEntries(items.map((c: any) => [c.id, 0])));
          setOrder(items.map((c: any) => c.id));
        } else {
          throw new Error('empty');
        }
      } catch {
        setCandidates(MOCK_CANDIDATES);
        setRatings(Object.fromEntries(MOCK_CANDIDATES.map(c => [c.id, 0])));
        setOrder(MOCK_CANDIDATES.map(c => c.id));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // sorted by rating desc, then by position in `order` (manual tiebreak)
  const ranked = [...candidates].sort((a, b) => {
    const diff = ratings[b.id] - ratings[a.id];
    if (diff !== 0) return diff;
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  const filtered = candidates.filter(c =>
    (c.name || '').includes(search) || (c.position || '').includes(search)
  );

  const allRated = candidates.length > 0 && candidates.every(c => ratings[c.id] > 0);

  const moveInOrder = (id: number, dir: -1 | 1) => {
    const score = ratings[id];
    const sameScoreInOrder = order.filter(oid => ratings[oid] === score);
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
      await Promise.all(ranked.map(c =>
        submitInterviewResult(c.id, { rate: ratings[c.id], notes: 'تم التقييم من النظام' })
      ));
      const rankingPayload = ranked.map((c, i) => ({ interview_id: c.id, rank: i + 1 }));
      await submitCandidatesRanking(4, { ranking: rankingPayload });
      setRankingSent(true);
      toast.success(iv.toasts.success);
    } catch {
      toast.error(iv.toasts.error);
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const getStatusInfo = (status: string, rating: number) => {
    const effectiveStatus = rating > 0 ? 'done' : (status || 'pending');
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: iv.statusPending, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      done: { label: iv.statusDone, cls: 'bg-green-50 text-green-700 border-green-200' },
      rejected: { label: iv.statusRejected, cls: 'bg-red-50 text-red-600 border-red-200' },
    };
    return map[effectiveStatus] || map.pending;
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 text-green">
      <Loader2 className="animate-spin mb-4" size={44} />
      <p className="font-bold text-lg">{lang === 'ar' ? 'جاري تحميل بيانات المرشحين...' : 'Loading candidates...'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-dark flex items-center gap-2">
            <ClipboardList size={22} className="text-green" />
            {iv.title}
          </h2>
          <p className="text-sm text-brown mt-1">
            {candidates.length} {iv.candidatesCount} · {candidates.filter(c => ratings[c.id] > 0).length} {iv.ratedCount}
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

      {!allRated && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-amber-700 text-sm font-medium">
          ⚠️ {iv.rateAllWarning}
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Left: Candidates List ── */}
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

          {filtered.map(c => {
            const rating = ratings[c.id] || 0;
            const isSelected = selectedCandidate?.id === c.id;
            const name = c.name || c.user?.name || (lang === 'ar' ? 'بدون اسم' : 'Unknown');
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
                    {name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-dark">{name}</p>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusInfo.cls}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-brown mt-0.5">
                      {c.position || (lang === 'ar' ? 'مرشح' : 'Candidate')} · {c.experience || 0} {iv.yearsExp}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(c.skills || []).slice(0, 4).map((s: string) => (
                        <span key={s} className="bg-green/10 text-green text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {c.cvScore != null && (
                    <div className="flex-shrink-0 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm border-2 ${c.cvScore >= 80 ? 'border-green text-green' : c.cvScore >= 60 ? 'border-amber-400 text-amber-600' : 'border-red-300 text-red-500'}`}>
                        {c.cvScore}%
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{iv.cvScore}</p>
                    </div>
                  )}
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
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <User size={40} className="mx-auto mb-3 opacity-30" />
              <p>{iv.noResults}</p>
            </div>
          )}
        </div>

        {/* ── Right: Live Ranking Panel ── */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={18} className="text-amber-500" />
              <h3 className="font-bold text-dark">{iv.rankingPanel}</h3>
            </div>
            <p className="text-[11px] text-gray-400 mb-5">{iv.rankingSubtitle}</p>

            <div className="space-y-3">
              {ranked.map((c, i) => {
                const score = ratings[c.id];
                const name = c.name || c.user?.name || (lang === 'ar' ? 'بدون اسم' : 'Unknown');
                const sameScoreInOrder = order.filter(oid => ratings[oid] === score);
                const isTied = sameScoreInOrder.length > 1 && score > 0;
                const posInTie = sameScoreInOrder.indexOf(c.id);

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

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isTied && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveInOrder(c.id, -1); }}
                            disabled={posInTie === 0}
                            className="w-6 h-6 rounded-md bg-gray-200 hover:bg-green/20 hover:text-green text-gray-500 transition-colors flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveInOrder(c.id, 1); }}
                            disabled={posInTie === sameScoreInOrder.length - 1}
                            className="w-6 h-6 rounded-md bg-gray-200 hover:bg-green/20 hover:text-green text-gray-500 transition-colors flex items-center justify-center disabled:opacity-30"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      )}
                      <span className={`text-sm font-extrabold w-8 text-end ${score > 0
                        ? i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-500' : i === 2 ? 'text-amber-700' : 'text-dark'
                        : 'text-gray-300'
                        }`}>
                        {score > 0 ? `${score}/5` : '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {allRated && !rankingSent && (
              <div className="mt-5 bg-green/5 border border-green/20 rounded-xl px-4 py-3 text-sm text-green font-semibold text-center">
                {iv.readyToSend}
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
