import { useState } from 'react';
import { mockEmployees } from '../../../data/mockData';
import { Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLanguage } from '../../../i18n/translations/LanguageContext';

// ── Types ──

type RatingKey = 'performance' | 'attendance' | 'behavior' | 'teamwork' | 'initiative';

type Ratings = Record<RatingKey, number>;

const DEFAULT_RATINGS: Ratings = {
  performance: 0,
  attendance:  0,
  behavior:    0,
  teamwork:    0,
  initiative:  0,
};

// ── Sub-components ──

interface RatingRowProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
}

function RatingRow({ label, icon, value, onChange }: RatingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-xl w-7 text-center">{icon}</span>
        <span className="text-sm font-semibold text-dark">{label}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`text-xl transition-all duration-150 hover:scale-110 hover:text-gold ${
              n <= value ? 'text-gold' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ──

export default function PeriodicEvaluation() {
  const { t } = useLanguage();

  const [selectedEmp, setSelectedEmp] = useState('');
  const [month, setMonth]             = useState('');
  const [ratings, setRatings]         = useState<Ratings>(DEFAULT_RATINGS);
  const [notes, setNotes]             = useState('');
  const [submitted, setSubmitted]     = useState(false);

  const ratingValues = Object.values(ratings).filter(Boolean);
  const avgRating = ratingValues.length
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
    : 0;

  const employee = mockEmployees.find(e => e.id === Number(selectedEmp));

  const criteriaKeys: Array<{ key: RatingKey; label: string; icon: string }> = [
    { key: 'performance', label: t.evaluation.criteria.performance, icon: '' },
    { key: 'attendance',  label: t.evaluation.criteria.attendance,  icon: '🛡️' },
    { key: 'behavior',    label: t.evaluation.criteria.behavior,    icon: '💚' },
    { key: 'teamwork',    label: t.evaluation.criteria.teamwork,    icon: '🏠' },
    { key: 'initiative',  label: t.evaluation.criteria.initiative,  icon: '💡' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !month || Object.values(ratings).some(v => v === 0)) {
      toast.error(t.evaluation.errorIncomplete);
      return;
    }
    setSubmitted(true);
    toast.success(t.evaluation.successMsg, { duration: 4000 });
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedEmp('');
    setRatings(DEFAULT_RATINGS);
    setNotes('');
    setMonth('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-dark">{t.evaluation.title}</h2>
        <p className="text-sm text-brown mt-1">{t.evaluation.subtitle}</p>
      </div>

      {submitted ? (
        /* Success Card */
        <div className="bg-white rounded-2xl border border-green/20 shadow-md p-10 text-center">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-bold text-green mb-2">{t.evaluation.successCard.title}</h3>
          <p className="text-brown text-sm mb-6">
            {t.evaluation.successCard.thankYou} <strong>{employee?.name}</strong>
          </p>
          <p className="text-3xl font-extrabold text-gold mb-1">{avgRating} ★</p>
          <p className="text-xs text-gray-400 mb-6">{t.evaluation.successCard.avgRating}</p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-dark transition-colors duration-150"
          >
            {t.evaluation.successCard.evaluateAnother}
          </button>
        </div>
      ) : (
        /* Main Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t.evaluation.form.selectEmployee}</label>
              <select
                className="form-input"
                value={selectedEmp}
                onChange={e => setSelectedEmp(e.target.value)}
              >
                <option value="">{t.evaluation.form.selectPlaceholder}</option>
                {mockEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">{t.evaluation.form.evalMonth}</label>
              <input
                type="month"
                className="form-input"
                value={month}
                onChange={e => setMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Scale hint */}
          <p className="text-xs text-gray-400 text-center">{t.evaluation.form.scaleHint}</p>

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
            <div className="bg-gold/10 border border-gold/25 rounded-xl p-4 text-center">
              <p className="text-xs text-brown font-semibold mb-1">{t.evaluation.form.avgRating}</p>
              <p className="text-3xl font-extrabold text-gold">{avgRating} ★</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="form-label">{t.evaluation.form.notes}</label>
            <textarea
              className="form-input resize-none h-28"
              placeholder={t.evaluation.form.notesPlaceholder}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-green text-white text-sm font-semibold hover:bg-green-dark active:scale-[0.99] transition-all duration-150 shadow-sm"
          >
            <Send size={15} />
            {t.evaluation.form.submit}
          </button>
        </form>
      )}
    </div>
  );
}