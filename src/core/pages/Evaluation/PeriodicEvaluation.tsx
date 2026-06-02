import { useState } from 'react';
import { mockEmployees } from '../../../data/mockData';
import { Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

interface RatingRowProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
}

type RatingKey = 'performance' | 'attendance' | 'behavior' | 'teamwork' | 'initiative';

function RatingRow({ label, icon, value, onChange }: RatingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl w-7 text-center">{icon}</span>
        <span className="text-sm font-semibold text-[#4A4E4A]">{label}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-xl transition-all duration-150 hover:scale-110 ${n <= value ? 'text-[#C4A66A]' : 'text-gray-300'
              } hover:text-[#C4A66A]`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PeriodicEvaluation() {
  const { t } = useLanguage();
  const [selectedEmp, setSelectedEmp] = useState('');
  const [month, setMonth] = useState('');
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    performance: 0,
    attendance: 0,
    behavior: 0,
    teamwork: 0,
    initiative: 0,
  });
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingValues = Object.values(ratings).filter(Boolean);
  const avgRating = ratingValues.length
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !month || Object.values(ratings).some(v => v === 0)) {
      toast.error(t.evaluation.errorIncomplete);
      return;
    }
    setSubmitted(true);
    toast.success(t.evaluation.successMsg, { duration: 4000 });
  };

  const employee = mockEmployees.find(e => e.id === Number(selectedEmp));

  const criteriaKeys: Array<{ key: RatingKey; label: string; icon: string }> = [
    { key: 'performance', label: t.evaluation.criteria.performance, icon: '📊' },
    { key: 'attendance', label: t.evaluation.criteria.attendance, icon: '🛡️' },
    { key: 'behavior', label: t.evaluation.criteria.behavior, icon: '💚' },
    { key: 'teamwork', label: t.evaluation.criteria.teamwork, icon: '🏠' },
    { key: 'initiative', label: t.evaluation.criteria.initiative, icon: '💡' },
  ];

  /* ── shared input style ── */
  const inputCls =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#4A4E4A] ' +
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/30 focus:border-[#4A7C59] ' +
    'transition-all duration-150';

  const labelCls = 'block mb-1.5 text-xs font-semibold text-[#6B6358] uppercase tracking-wide';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-[#4A4E4A]">{t.evaluation.title}</h2>
        <p className="text-sm text-[#6B6358] mt-1">
          {t.evaluation.subtitle}
        </p>
      </div>

      {submitted ? (
        /* ── Success Card ── */
        <div className="bg-white rounded-2xl border border-[#4A7C59]/20 shadow-md p-10 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-[#4A7C59] mb-2">{t.evaluation.successCard.title}</h3>
          <p className="text-[#6B6358] text-sm mb-6">
            {t.evaluation.successCard.thankYou} <strong>{employee?.name}</strong>
          </p>
          <p className="text-3xl font-extrabold text-[#C4A66A] mb-1">{avgRating} ★</p>
          <p className="text-xs text-gray-400 mb-6">{t.evaluation.successCard.avgRating}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedEmp('');
              setRatings({ performance: 0, attendance: 0, behavior: 0, teamwork: 0, initiative: 0 });
              setNotes('');
              setMonth('');
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4A7C59] text-white text-sm font-semibold hover:bg-[#3a6347] transition-colors duration-150"
          >
            {t.evaluation.successCard.evaluateAnother}
          </button>
        </div>
      ) : (
        /* ── Main Form ── */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t.evaluation.form.selectEmployee}</label>
              <select
                className={inputCls}
                value={selectedEmp}
                onChange={e => setSelectedEmp(e.target.value)}
              >
                <option value="">{t.evaluation.form.selectPlaceholder}</option>
                {mockEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.evaluation.form.evalMonth}</label>
              <input
                type="month"
                className={inputCls}
                value={month}
                onChange={e => setMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Scale hint */}
          <p className="text-xs text-gray-400 text-center">
            {t.evaluation.form.scaleHint}
          </p>

          {/* Rating Criteria */}
          <div className="divide-y divide-gray-100">
            {criteriaKeys.map(({ key, label, icon }) => (
              <RatingRow
                key={key}
                label={label}
                icon={icon}
                value={ratings[key]}
                onChange={v => setRatings(prev => ({ ...prev, [key]: v }))}
              />
            ))}
          </div>

          {/* Average Badge */}
          {Number(avgRating) > 0 && (
            <div className="bg-[#C4A66A]/10 border border-[#C4A66A]/25 rounded-xl p-4 text-center">
              <p className="text-xs text-[#6B6358] font-semibold mb-1">{t.evaluation.form.avgRating}</p>
              <p className="text-3xl font-extrabold text-[#C4A66A]">{avgRating} ★</p>
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className={labelCls}>{t.evaluation.form.notes}</label>
            <textarea
              className={`${inputCls} resize-none h-28`}
              placeholder={t.evaluation.form.notesPlaceholder}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#4A7C59] text-white text-sm font-semibold hover:bg-[#3a6347] active:scale-[0.99] transition-all duration-150 shadow-sm"
          >
            <Send size={15} />
            {t.evaluation.form.submit}
          </button>
        </form>
      )}
    </div>
  );
}