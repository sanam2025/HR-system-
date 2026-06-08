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

        {/* Selected Skills Tags */}
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

        {/* Skill Search Input */}
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

          {/* Dropdown */}
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
