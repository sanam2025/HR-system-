import { useState } from 'react';
import { Send, ClipboardList, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';
import { createJobRequisition } from '../../../api/recruitment';

import type ar from '../../../i18n/translations/ar';
type RecruitmentTranslation = typeof ar['recruitment'];

const SKILL_OPTIONS = [
  'PHP', 'Laravel', 'JavaScript', 'Vue.js', 'MySQL',
  'Project Management', 'Problem Solving', 'Communication Skills',
  'Teamwork', 'Time Management',
];

function JobVacancyRequest({ r }: { r: RecruitmentTranslation }) {
  const v = r.vacancy;

  const [form, setForm] = useState({
    title: '',
    description: '',
    experience: 0,
    skills: [] as string[],
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error(v.toasts.fillAll); return; }
    setIsSubmitting(true);
    try {
      await createJobRequisition({
        job_title: form.title,
        description: form.description,
        experience: form.experience,
        skills: [1],
      });
      setSent(true);
      toast.success(v.toasts.success);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'حدث خطأ أثناء الإرسال';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const availableSkills = SKILL_OPTIONS.filter(s => !form.skills.includes(s));

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-green/20 shadow-card p-10 text-center">
        <div className="text-5xl mb-4">📨</div>
        <h3 className="text-lg font-bold text-green mb-2">{v.successTitle}</h3>
        <p className="text-brown text-sm mb-5">
          {v.successNote} <strong>{form.title}</strong> {v.successNote2}
        </p>
        <button
          onClick={() => { setSent(false); setForm({ title: '', description: '', experience: 0, skills: [] }); }}
          className="btn-primary btn"
        >
          {v.sendAnother}
        </button>
      </div>
    );
  }

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

      {/* Skills */}
      <div>
        <label className="form-label">{v.requirements}</label>

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map(skill => (
              <span
                key={skill}
                onClick={() => toggleSkill(skill)}
                title="انقر للحذف"
                className="flex items-center gap-1.5 bg-green/10 text-green text-xs font-semibold px-3 py-1.5 rounded-full border border-green/20 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                {skill}
                <span className="text-[10px] opacity-70">✕</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <select
            className="form-input w-full cursor-pointer hover:border-green transition-colors"
            value={selectedSkill}
            onChange={e => {
              const val = e.target.value;
              if (val && !form.skills.includes(val)) toggleSkill(val);
              setSelectedSkill('');
            }}
          >
            <option value="">{v.selectSkill || '-- اختر مهارة --'}</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              className="form-input flex-1"
              placeholder={v.customSkillPlaceholder || 'أو اكتب مهارة غير موجودة...'}
              value={customSkill}
              onChange={e => setCustomSkill(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (customSkill.trim() && !form.skills.includes(customSkill.trim())) {
                    toggleSkill(customSkill.trim());
                    setCustomSkill('');
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (customSkill.trim() && !form.skills.includes(customSkill.trim())) {
                  toggleSkill(customSkill.trim());
                  setCustomSkill('');
                }
              }}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 px-6"
            >
              {v.addCustomSkillBtn || 'إضافة'}
            </button>
          </div>
        </div>

        {form.skills.length === 0 && (
          <p className="text-xs text-gray-400 mt-1.5">{v.requirementsHint}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary btn w-full flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {isSubmitting ? 'جاري الإرسال...' : v.submitBtn}
      </button>
    </form>
  );
}

export default function Recruitment() {
  const { t } = useLanguage();
  const r = t.recruitment;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      <div>
        <h2 className="text-xl font-extrabold text-dark">{r.title}</h2>
        <p className="text-sm text-brown mt-1">{r.subtitle}</p>
      </div>
      <JobVacancyRequest r={r} />
    </div>
  );
}
