import { useState } from 'react';
import { mockCandidates } from '../../../data/mockData';
import { Send, ClipboardList, Trophy } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import en from '../../../i18n/translations/en';

type RecruitmentTranslation = typeof en.recruitment;

// ── Job Vacancy Request ───────
function JobVacancyRequest({ r }: { r: RecruitmentTranslation }) {
  const v = r.vacancy;

  const [form, setForm] = useState({ title: '', count: 1, reason: '', requirements: '', deadline: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.reason) { toast.error(v.toasts.fillAll); return; }
    setSent(true);
    toast.success(v.toasts.success);
  };

  if (sent) return (
    <div className="bg-white rounded-2xl border border-green/20 shadow-card p-10 text-center">
      <div className="text-5xl mb-4">📨</div>
      <h3 className="text-lg font-bold text-green mb-2">{v.successTitle}</h3>
      <p className="text-brown text-sm mb-5">{v.successNote} <strong>{form.title}</strong> {v.successNote2}</p>
      <button onClick={() => { setSent(false); setForm({ title: '', count: 1, reason: '', requirements: '', deadline: '' }); }}
        className="btn-primary btn">{v.sendAnother}</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 space-y-4">
      <h3 className="font-bold text-dark text-lg flex items-center gap-2 mb-4">
        <ClipboardList className="text-[#6B6358]" size={20} />
        {v.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">{v.positionTitle} <span className="text-red-500">*</span></label>
          <input className="form-input" placeholder={v.positionPlaceholder} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="form-label">{v.count}</label>
          <input type="number" min="1" className="form-input" value={form.count} onChange={e => setForm({ ...form, count: parseInt(e.target.value) || 1 })} />
        </div>
      </div>
      <div>
        <label className="form-label">{v.reason} <span className="text-red-500">*</span></label>
        <textarea className="form-input resize-none h-20" placeholder={v.reasonPlaceholder} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
      </div>
      <div>
        <label className="form-label">{v.requirements}</label>
        <textarea className="form-input resize-none h-20" placeholder={v.requirementsPlaceholder} value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} />
      </div>
      <div>
        <label className="form-label">{v.deadline}</label>
        <input type="date" className="form-input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
      </div>
      <button type="submit" className="btn-primary btn w-full flex items-center justify-center gap-2">
        <Send size={16} /> {v.submitBtn}
      </button>
    </form>
  );
}

// ── Candidate Evaluation ───
function CandidateEvaluation({ r }: { r: RecruitmentTranslation }) {
  const cd = r.candidates;

  const [candidates, setCandidates] = useState(mockCandidates.map((c, i) => ({ ...c, rank: i + 1 })));
  const [sent, setSent] = useState(false);

  const sorted = [...candidates].sort((a, b) => a.rank - b.rank);

  const moveUp = (id: number) => {
    const arr = [...candidates];
    const idx = arr.findIndex(c => c.id === id);
    if (idx === 0) return;
    [arr[idx - 1].rank, arr[idx].rank] = [arr[idx].rank, arr[idx - 1].rank];
    setCandidates([...arr]);
  };
  const moveDown = (id: number) => {
    const arr = [...candidates];
    const idx = arr.findIndex(c => c.id === id);
    if (idx === arr.length - 1) return;
    [arr[idx + 1].rank, arr[idx].rank] = [arr[idx].rank, arr[idx + 1].rank];
    setCandidates([...arr]);
  };

  const handleSend = () => {
    setSent(true);
    toast.success(cd.toasts.success);
  };

  const rankColors = ['bg-gold text-white', 'bg-gray-400 text-white', 'bg-amber-700 text-white'];

  if (sent) return (
    <div className="bg-white rounded-2xl border border-gold/20 shadow-card p-10 text-center">
      <div className="text-5xl mb-4">🏆</div>
      <h3 className="text-lg font-bold text-gold mb-2">{cd.successTitle}</h3>
      <p className="text-brown text-sm">{cd.successNote}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark text-lg flex items-center gap-2">
          <Trophy className="text-[#C4A66A]" size={20} /> {cd.title}
        </h3>
        <button onClick={handleSend} className="btn-gold btn flex items-center gap-2">
          <Send size={15} /> {cd.sendRanking}
        </button>
      </div>
      <p className="text-xs text-gray-400">{cd.moveHint}</p>

      <div className="space-y-3">
        {sorted.map((c, i) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${rankColors[i] || 'bg-gray-100 text-gray-600'}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-dark text-sm">{c.name}</p>
              <p className="text-xs text-brown mt-0.5">{c.experience} {cd.experience}</p>
              <div className="flex gap-1 flex-wrap mt-1.5">
                {c.skills.map(s => (
                  <span key={s} className="bg-green/10 text-green text-[10px] font-semibold px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="text-center flex-shrink-0 hidden md:block">
              <p className="text-xs text-gray-400">{cd.interviewScore}</p>
              <p className="font-bold text-dark">{c.interviewScore}%</p>
            </div>
            <div className="text-center flex-shrink-0 hidden md:block">
              <p className="text-xs text-gray-400">{cd.cvScore}</p>
              <p className="font-bold text-dark">{c.cvScore}%</p>
            </div>
            <div className="text-center flex-shrink-0 hidden md:block">
              <p className="text-xs text-gray-400">{cd.totalScore}</p>
              <p className="font-bold text-gold">{Math.round((c.interviewScore + c.cvScore) / 2)}%</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button onClick={() => moveUp(c.id)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-green/10 hover:text-green text-gray-500 text-xs font-bold transition-colors flex items-center justify-center">↑</button>
              <button onClick={() => moveDown(c.id)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-green/10 hover:text-green text-gray-500 text-xs font-bold transition-colors flex items-center justify-center">↓</button>
            </div>
          </div>
        ))}
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
