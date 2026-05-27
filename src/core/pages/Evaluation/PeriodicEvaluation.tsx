import { useState } from 'react';
import { mockEmployees } from '../../../data/mockData';
import { Send, Star } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
      toast.error('Please fill in all fields and rate all criteria');
      return;
    }
    setSubmitted(true);
    toast.success('Evaluation submitted successfully!', { duration: 4000 });
  };

  const employee = mockEmployees.find(e => e.id === Number(selectedEmp));

  const criteriaKeys: Array<{ key: RatingKey; label: string; icon: string }> = [
    { key: 'performance', label: 'Performance Quality & Productivity', icon: '📊' },
    { key: 'attendance', label: 'Discipline & Attendance', icon: '🛡️' },
    { key: 'behavior', label: 'Professional Behavior & Interaction', icon: '💚' },
    { key: 'teamwork', label: 'Teamwork & Collaboration', icon: '🏠' },
    { key: 'initiative', label: 'Initiative & Creativity', icon: '💡' },
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
        <h2 className="text-2xl font-extrabold text-[#4A4E4A]">Periodic Evaluation</h2>
        <p className="text-sm text-[#6B6358] mt-1">
          Comprehensive evaluation of performance, attendance, and behavior
        </p>
      </div>

      {submitted ? (
        /* ── Success Card ── */
        <div className="bg-white rounded-2xl border border-[#4A7C59]/20 shadow-md p-10 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-[#4A7C59] mb-2">Evaluation Submitted!</h3>
          <p className="text-[#6B6358] text-sm mb-6">
            Thank you for evaluating <strong>{employee?.name}</strong>
          </p>
          <p className="text-3xl font-extrabold text-[#C4A66A] mb-1">{avgRating} ★</p>
          <p className="text-xs text-gray-400 mb-6">Overall Average Rating</p>
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
            Evaluate Another Employee
          </button>
        </div>
      ) : (
        /* ── Main Form ── */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 space-y-6"
        >
          {/* Employee & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Select Employee *</label>
              <select
                className={inputCls}
                value={selectedEmp}
                onChange={e => setSelectedEmp(e.target.value)}
              >
                <option value="">-- Select an Employee --</option>
                {mockEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Evaluation Month *</label>
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
            1 = Poor &nbsp;–&nbsp; 5 = Excellent
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
              <p className="text-xs text-[#6B6358] font-semibold mb-1">Overall Average Rating</p>
              <p className="text-3xl font-extrabold text-[#C4A66A]">{avgRating} ★</p>
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className={labelCls}>Additional Notes</label>
            <textarea
              className={`${inputCls} resize-none h-28`}
              placeholder="Add your detailed notes about the employee's performance..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#4A7C59] text-white text-sm font-semibold hover:bg-[#3a6347] active:scale-[0.99] transition-all duration-150 shadow-sm"
          >
            <Send size={15} />
            Submit Evaluation to HR
          </button>
        </form>
      )}
    </div>
  );
}