import { useState } from 'react';
import { mockCandidates } from '../../../data/mockData';
import { Send, ClipboardList, Trophy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import en from '../../../i18n/translations/en';

type RecruitmentTranslation = typeof en.recruitment;

const SKILL_OPTIONS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C#', 'C++',
  'Vue.js', 'Angular', 'Next.js', 'Laravel', 'Django', 'Spring Boot',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Linux',
  'Figma', 'UI/UX Design', 'Tailwind CSS', 'CSS', 'HTML',
  'Machine Learning', 'Data Analysis', 'Agile', 'Scrum',
];

// ── Job Vacancy Request ───────
function JobVacancyRequest({ r }: { r: RecruitmentTranslation }) {
  const v = r.vacancy;

  const [form, setForm] = useState({ title: '', description: '', experience: 0, skills: [] as string[] });
  const [sent, setSent] = useState(false);
  const [skillSearch, setSkillSearch] = useState('');
  const [skillDropOpen, setSkillDropOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error(v.toasts.fillAll); return; }
    setSent(true);
    toast.success(v.toasts.success);
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const filteredSkills = SKILL_OPTIONS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) && !form.skills.includes(s)
  );

  if (sent) return (
    <div className="bg-white rounded-2xl border border-green/20 shadow-card p-10 text-center">
      <div className="text-5xl mb-4">📨</div>
      <h3 className="text-lg font-bold text-green mb-2">{v.successTitle}</h3>
      <p className="text-brown text-sm mb-5">{v.successNote} <strong>{form.title}</strong> {v.successNote2}</p>
      <button onClick={() => { setSent(false); setForm({ title: '', description: '', experience: 0, skills: [] }); }}
        className="btn-primary btn">{v.sendAnother}</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-5">
      <h3 className="font-bold text-dark text-lg flex items-center gap-2 mb-4">
        <ClipboardList className="text-[#6B6358]" size={20} />
        {v.title}
      </h3>

      {/* Job Title */}
      <div>
        <label className="form-label">{v.positionTitle} <span className="text-red-500">*</span></label>
        <input
          className="form-input"
          placeholder={v.positionPlaceholder}
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="form-label">{v.description} <span className="text-red-500">*</span></label>
        <textarea
          className="form-input resize-none h-24"
          placeholder={v.descriptionPlaceholder}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Experience */}
      <div>
        <label className="form-label">{v.experience} <span className="text-red-500">*</span></label>
        <input
          type="number"
          min="0"
          className="form-input"
          placeholder="0"
          value={form.experience}
          onChange={e => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
        />
      </div>

      {/* Skills Multi-Select */}
      <div>
        <label className="form-label">{v.requirements}</label>

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map(skill => (
              <span
                key={skill}
                className="flex items-center gap-1.5 bg-green/10 text-green text-xs font-semibold px-3 py-1.5 rounded-full border border-green/20 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                onClick={() => toggleSkill(skill)}
                title="انقر للحذف"
              >
                {skill}
                <span className="text-[10px] opacity-70">✕</span>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            className="form-input"
            placeholder={v.requirementsPlaceholder}
            value={skillSearch}
            onChange={e => setSkillSearch(e.target.value)}
            onFocus={() => setSkillDropOpen(true)}
            onBlur={() => setTimeout(() => setSkillDropOpen(false), 150)}
          />
          {skillDropOpen && filteredSkills.length > 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filteredSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onMouseDown={() => toggleSkill(skill)}
                  className="w-full text-start px-4 py-2.5 text-sm text-dark hover:bg-green/5 hover:text-green transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {form.skills.length === 0 && (
          <p className="text-xs text-gray-400 mt-1.5">ابحث عن مهارة واضغط عليها لإضافتها</p>
        )}
      </div>

      <button type="submit" className="btn-primary btn w-full flex items-center justify-center gap-2">
        <Send size={16} /> {v.submitBtn}
      </button>
    </form>
  );
}

// ── Star Rating Widget ───────
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
          className={`text-lg transition-all ${star <= (hover || value)
              ? 'text-amber-400 scale-110'
              : 'text-gray-200 hover:text-amber-300'
            } ${!onChange ? 'cursor-default' : 'cursor-pointer'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ── Candidate Evaluation ───
function CandidateEvaluation({ r }: { r: RecruitmentTranslation }) {
  const cd = r.candidates;

  // interview rating per candidate (0 = not rated)
  const [ratings, setRatings] = useState<Record<number, number>>(
    Object.fromEntries(mockCandidates.map(c => [c.id, 0]))
  );
  // manual order IDs (used to break ties)
  const [order, setOrder] = useState<number[]>(mockCandidates.map(c => c.id));
  const [sent, setSent] = useState(false);

  const allRated = mockCandidates.every(c => ratings[c.id] > 0);

  // Sort: primary = rating descending, secondary = manual order position
  const ranked = [...mockCandidates].sort((a, b) => {
    const diff = ratings[b.id] - ratings[a.id];
    if (diff !== 0) return diff;
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  // Move within same-score group only
  const moveInOrder = (id: number, dir: -1 | 1) => {
    const currentScore = ratings[id];
    const sameScore = ranked.filter(c => ratings[c.id] === currentScore).map(c => c.id);
    const pos = sameScore.indexOf(id);
    if (dir === -1 && pos === 0) return;
    if (dir === 1 && pos === sameScore.length - 1) return;

    const newOrder = [...order];
    const idxA = newOrder.indexOf(id);
    const idxB = newOrder.indexOf(sameScore[pos + dir]);
    [newOrder[idxA], newOrder[idxB]] = [newOrder[idxB], newOrder[idxA]];
    setOrder(newOrder);
  };

  const handleSend = () => {
    if (!allRated) { toast.error(cd.rateAllFirst); return; }
    setSent(true);
    toast.success(cd.toasts.success);
  };

  const medalColors = [
    'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-200',
    'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-200',
    'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-300',
  ];
  const medalEmojis = ['🥇', '🥈', '🥉'];

  if (sent) return (
    <div className="bg-white rounded-2xl border border-gold/20 shadow-card p-10 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h3 className="text-lg font-bold text-gold mb-2">{cd.successTitle}</h3>
      <p className="text-brown text-sm mb-6">{cd.successNote}</p>
      <div className="space-y-3 max-w-md mx-auto">
        {ranked.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <span className="text-xl">{medalEmojis[i] || String(i + 1)}</span>
            <div className="flex-1 text-start">
              <p className="font-bold text-dark text-sm">{c.name}</p>
              <p className="text-xs text-brown">{c.position}</p>
            </div>
            <StarRating value={ratings[c.id]} max={5} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark text-lg flex items-center gap-2">
          <Trophy className="text-[#C4A66A]" size={20} /> {cd.title}
        </h3>
        <button
          onClick={handleSend}
          disabled={!allRated}
          className={`btn flex items-center gap-2 transition-all ${allRated ? 'btn-gold' : 'bg-gray-100 text-gray-400 cursor-not-allowed px-4 py-2 rounded-xl text-sm font-semibold'}`}
        >
          <Send size={15} /> {cd.sendRanking}
        </button>
      </div>

      {!allRated && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 font-medium">
          ⚠️ {cd.rateAllFirst}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Rating Cards */}
        <div className="lg:col-span-3 space-y-3">
          {mockCandidates.map(c => {
            const score = ratings[c.id];
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-green/15 flex items-center justify-center text-green font-bold text-sm flex-shrink-0">
                  {c.name.charAt(0)}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark text-sm">{c.name}</p>
                  <p className="text-xs text-brown mb-1.5">{c.experience} {cd.experience} · {c.position}</p>
                  <div className="flex gap-1 flex-wrap">
                    {c.skills.map(s => (
                      <span key={s} className="bg-green/10 text-green text-[10px] font-semibold px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                {/* Star Rating */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs font-semibold text-brown">{cd.interviewScore}</span>
                  <StarRating
                    value={score}
                    onChange={v => setRatings(prev => ({ ...prev, [c.id]: v }))}
                    max={5}
                  />
                  {score === 0 && (
                    <span className="text-[10px] text-gray-400">{cd.notRatedYet}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Ranking */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sticky top-4">
            <h4 className="font-bold text-dark text-sm mb-1 flex items-center gap-2">
              <span>🏆</span> {cd.liveRanking}
            </h4>
            <p className="text-[11px] text-gray-400 mb-4">{cd.tieHint}</p>
            <div className="space-y-2.5">
              {ranked.map((c, i) => {
                const score = ratings[c.id];
                const sameScore = ranked.filter(x => ratings[x.id] === score);
                const isTied = sameScore.length > 1 && score > 0;
                const posInTie = sameScore.findIndex(x => x.id === c.id);

                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === 0 && score > 0 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'
                      }`}
                  >
                    {/* Medal */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${medalColors[i] || 'bg-gray-100 text-gray-600'
                      }`}>
                      {i < 3 ? medalEmojis[i] : i + 1}
                    </div>
                    {/* Name + Stars */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-dark truncate">{c.name}</p>
                      <StarRating value={score} max={5} />
                    </div>
                    {/* Score or Tie Controls */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isTied && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveInOrder(c.id, -1)}
                            disabled={posInTie === 0}
                            className="w-6 h-6 rounded-md bg-gray-200 hover:bg-green/20 hover:text-green text-gray-500 text-xs font-bold transition-colors flex items-center justify-center disabled:opacity-30"
                          >↑</button>
                          <button
                            onClick={() => moveInOrder(c.id, 1)}
                            disabled={posInTie === sameScore.length - 1}
                            className="w-6 h-6 rounded-md bg-gray-200 hover:bg-green/20 hover:text-green text-gray-500 text-xs font-bold transition-colors flex items-center justify-center disabled:opacity-30"
                          >↓</button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function Recruitment() {
  const { t } = useLanguage();
  const r = t.recruitment;
  const tabs = [r.tabVacancy, r.tabCandidates];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h2 className="text-xl font-extrabold text-dark">{r.title}</h2>
        <p className="text-sm text-brown mt-1">{r.subtitle}</p>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === i ? 'bg-white text-green shadow-sm' : 'text-brown hover:text-dark'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0
        ? <JobVacancyRequest r={r} />
        : <CandidateEvaluation r={r} />
      }
    </div>
  );
}
