import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAvailableJobs, submitJobApplication } from '../../../api/publicJobs';
import {
  Briefcase, Search, Clock, Users,
  CheckCircle2, XCircle, CalendarDays,
  ExternalLink, Send, X, User, Mail, Phone, FileText,
  Loader2, Globe, Upload
} from 'lucide-react';

// ── i18n (self-contained, no LanguageProvider dependency) ──
type Lang = 'ar' | 'en';

const TEXTS = {
  ar: {
    dir: 'rtl' as const,
    font: "'Tajawal', 'Inter', sans-serif",
    brand: 'نظام الموارد البشرية',
    portal: 'بوابة الوظائف',
    loginBtn: 'تسجيل الدخول',
    langLabel: 'English',
    hero1: 'خطّط لمستقبلك معنا ',
    hero2: ' كن جزءًا من نخبة من المحترفين والخبراء',
    searchPlaceholder: 'ابحث عن وظيفة، قسم، أو موقع...',
    statsEmployees: 'موظف',
    statsJobs: 'وظيفة متاحة',
    statsDept: 'قسم',
    sectionTitle: 'الوظائف المتاحة',
    results: (n: number, q: string) => q ? `${n} نتيجة لـ "${q}"` : `${n} نتيجة`,
    filterAll: 'الكل',
    filterOpen: 'متاحة',
    filterClosed: 'مغلقة',
    available: 'متاحة',
    closed: 'مغلقة',
    applyBtn: 'قدّم الآن',
    closedBtn: 'التقديم مغلق',
    detailsBtn: 'التفاصيل',
    hideBtn: 'إخفاء',
    postedDate: 'تاريخ النشر:',
    deadline: 'آخر موعد:',
    applicants: 'متقدم',
    emptyTitle: 'لا توجد نتائج',
    emptyDesc: 'جرّب البحث بكلمات مختلفة',
    footerEmployee: 'هل أنت موظف؟',
    footerLogin: 'سجّل دخولك هنا',
    footerNote: 'يمكنك مشاركة رابط هذه الصفحة مع المتقدمين دون الحاجة لتسجيل دخول.',
    modalTitle: 'تقدّم للوظيفة',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'محمد أحمد',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'example@email.com',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: '+963 9XX XXX XXX',
    coverLabel: 'رسالة التقدم (اختياري)',
    coverPlaceholder: 'أخبرنا عن نفسك ولماذا تناسب هذه الوظيفة...',
    cvLabel: 'السيرة الذاتية (CV)',
    cvPlaceholder: 'أرفق سيرتك الذاتية (PDF, DOCX)',
    cvSelected: 'تم الاختيار',
    required: '*',
    sendBtn: 'إرسال الطلب',
    sending: 'جاري الإرسال...',
    successTitle: 'تم إرسال طلبك!',
    successNote: (name: string) => `شكراً ${name}، تلقّينا طلبك للوظيفة. سيتواصل معك فريق الموارد البشرية قريباً.`,
    backBtn: 'العودة للوظائف',
    typeFullTime: 'دوام كامل',
    typePartTime: 'دوام جزئي',
    typeRemote: 'عن بُعد',
  },
  en: {
    dir: 'ltr' as const,
    font: "'Inter', 'Tajawal', sans-serif",
    brand: 'HR Management System',
    portal: 'Careers Portal',
    loginBtn: 'Login',
    langLabel: 'العربية',
    badge: (n: number) => `${n} open positions now`,
    hero1: 'Build Your Future With Us',
    hero2: 'Join a team of experts and talented professionals. We are looking for exceptional talent to build a better tomorrow.',
    searchPlaceholder: 'Search by job title, department, or location...',
    statsEmployees: 'Employees',
    statsJobs: 'Open Jobs',
    statsDept: 'Departments',
    sectionTitle: 'Available Positions',
    results: (n: number, q: string) => q ? `${n} results for "${q}"` : `${n} results`,
    filterAll: 'All',
    filterOpen: 'Open',
    filterClosed: 'Closed',
    available: 'Open',
    closed: 'Closed',
    applyBtn: 'Apply Now',
    closedBtn: 'Applications Closed',
    detailsBtn: 'Details',
    hideBtn: 'Hide',
    postedDate: 'Posted:',
    deadline: 'Deadline:',
    applicants: 'applicants',
    emptyTitle: 'No results found',
    emptyDesc: 'Try different search terms',
    footerEmployee: 'Are you an employee?',
    footerLogin: 'Login here',
    footerNote: 'Share this page link with applicants — no login required.',
    modalTitle: 'Apply for Position',
    nameLabel: 'Full Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'example@email.com',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+1 XXX XXX XXXX',
    coverLabel: 'Cover Letter (optional)',
    coverPlaceholder: 'Tell us about yourself and why you are a great fit...',
    cvLabel: 'Resume / CV',
    cvPlaceholder: 'Upload your resume (PDF, DOCX)',
    cvSelected: 'Selected',
    required: '*',
    sendBtn: 'Submit Application',
    sending: 'Submitting...',
    successTitle: 'Application Submitted!',
    successNote: (name: string) => `Thank you ${name}, we received your application. Our HR team will reach out to you soon.`,
    backBtn: 'Back to Jobs',
    typeFullTime: 'Full Time',
    typePartTime: 'Part Time',
    typeRemote: 'Remote',
  },
} satisfies Record<Lang, object>;

// ── Types ────────────────────────────────────────────────
interface Job {
  id: number;
  job_title: string;
  description: string;
  status: string;
  posted_at?: string;
  department?: string;
  experience?: number;
  skills?: string[];
  type?: 'fullTime' | 'partTime' | 'remote';
}

const TYPE_COLORS: Record<string, string> = {
  fullTime: 'bg-blue-50 text-blue-700 border-blue-100',
  partTime: 'bg-purple-50 text-purple-700 border-purple-100',
  remote: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  default: 'bg-gray-50 text-gray-700 border-gray-100'
};

// ── Apply Modal ──────────────────────────────────────────
function ApplyModal({
  job, lang, onClose,
}: {
  job: Job;
  lang: Lang;
  onClose: () => void;
}) {
  const tx = TEXTS[lang];
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '', cv: null as File | null });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const dir = tx.dir;

  const mutation = useMutation({
    mutationFn: (formData: FormData) => submitJobApplication(job.id, formData),
    onSuccess: () => {
      setSubmitted(true);
      setErrorMsg('');
    },
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.cv) return;
    
    const formData = new FormData();
    formData.append('full_name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (form.coverLetter) formData.append('cover_letter', form.coverLetter);
    formData.append('cv', form.cv);
    // Include dummy or default values if required by backend
    formData.append('experience', '1');
    formData.append('skill_ids[]', '1');

    setErrorMsg('');
    mutation.mutate(formData);
  };

  const isSubmitting = mutation.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(30,41,59,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        dir={dir}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-modal animate-slide-up overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
          <div>
            <h3 className="font-extrabold text-[#4A4E4A] text-base sm:text-lg">{tx.modalTitle}</h3>
            <p className="text-xs sm:text-sm text-[#6B6358] mt-0.5">
              {job.job_title} · {job.department || 'N/A'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-10 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#4A7C59]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-[#4A7C59]" />
            </div>
            <h4 className="font-extrabold text-[#4A4E4A] text-lg sm:text-xl mb-2">{tx.successTitle}</h4>
            <p className="text-[#6B6358] text-sm leading-relaxed mb-6 max-w-sm">
              {tx.successNote(form.name)}
            </p>
            <button onClick={onClose} className="btn btn-primary w-full sm:w-auto">
              {tx.backBtn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Name */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <User size={11} /> {tx.nameLabel} <span className="text-red-500">{tx.required}</span>
              </label>
              <input
                className="form-input"
                placeholder={tx.namePlaceholder}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Mail size={11} /> {tx.emailLabel} <span className="text-red-500">{tx.required}</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder={tx.emailPlaceholder}
                dir="ltr"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            {/* Phone */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Phone size={11} /> {tx.phoneLabel} <span className="text-red-500">{tx.required}</span>
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder={tx.phonePlaceholder}
                dir="ltr"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            {/* CV Upload */}
            <div>
              <label className="form-label flex items-center gap-1.5 mb-1.5">
                <FileText size={11} /> {tx.cvLabel} <span className="text-red-500">{tx.required}</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={e => setForm({ ...form, cv: e.target.files ? e.target.files[0] : null })}
                  required
                />
                <div className={`form-input flex items-center justify-between border-dashed cursor-pointer transition-colors ${form.cv ? 'border-[#4A7C59] bg-[#4A7C59]/5' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${form.cv ? 'bg-[#4A7C59]/10' : 'bg-gray-100'}`}>
                      <Upload size={14} className={form.cv ? "text-[#4A7C59]" : "text-gray-400"} />
                    </div>
                    <span className={`text-sm truncate ${form.cv ? 'text-[#4A4E4A] font-medium' : 'text-gray-400'}`} dir="ltr">
                      {form.cv ? form.cv.name : tx.cvPlaceholder}
                    </span>
                  </div>
                  {form.cv && (
                    <span className="text-[10px] sm:text-xs font-bold text-[#4A7C59] bg-[#4A7C59]/10 px-2 sm:px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ml-2">
                      {tx.cvSelected}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Cover Letter */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <FileText size={11} /> {tx.coverLabel}
              </label>
              <textarea
                className="form-input resize-none h-20 sm:h-24"
                placeholder={tx.coverPlaceholder}
                value={form.coverLetter}
                onChange={e => setForm({ ...form, coverLetter: e.target.value })}
              />
            </div>
            {errorMsg && (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg text-xs font-semibold text-center border border-red-100">
                {errorMsg}
              </div>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-2.5 sm:py-3 flex justify-center mt-2 sm:mt-4 text-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> {tx.sending}</span>
              ) : (
                <span className="flex items-center gap-2"><Send size={16} /> {tx.sendBtn}</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Job Card ─────────────────────────────────────────────
function JobCard({
  job, lang, onApply,
}: {
  job: Job;
  lang: Lang;
  onApply: (job: Job) => void;
}) {
  const tx = TEXTS[lang];
  const typeLabel = tx[`type${job.type?.charAt(0).toUpperCase() + job.type?.slice(1)}` as 'typeFullTime' | 'typePartTime' | 'typeRemote'];

  return (
    <div
      id={`job-${job.id}`}
      className={`bg-white rounded-2xl border shadow-card transition-all duration-300 overflow-hidden group flex flex-col
        ${job.status === 'open'
          ? 'border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5'
          : 'border-gray-100 opacity-70'
        }`}
    >
      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-3 sm:mb-4">
          <div>
            <h3 className="font-extrabold text-[#4A4E4A] text-sm sm:text-base leading-tight mb-1">
              {job.job_title}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6B6358] flex items-center gap-1">
              <Briefcase size={12} className="text-[#C4A66A]" />
              {job.department || 'N/A'}
            </p>
          </div>
          {job.status === 'open' && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-100 flex-shrink-0">
              <CheckCircle2 size={10} /> {tx.available}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#6B6358] leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Requirements */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
            {job.skills.map(req => (
              <span
                key={req}
                className="text-[10px] sm:text-[11px] font-semibold bg-[#4A7C59]/8 text-[#4A7C59] border border-[#4A7C59]/15 px-2 sm:px-2.5 py-1 rounded-full"
              >
                {req}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#6B6358]">
          <span className={`flex items-center gap-1 border rounded-full px-2 py-0.5 text-[10px] sm:text-xs ${TYPE_COLORS[job.type || 'default'] || TYPE_COLORS.default}`}>
            <Clock size={10} /> {typeLabel}
          </span>
          {job.posted_at && (
            <span className="flex items-center gap-1">
              <CalendarDays size={11} className="text-[#C4A66A] flex-shrink-0" />
              {tx.postedDate} {job.posted_at.split('T')[0]}
            </span>
          )}
        </div>

      </div>

      {/* Card Footer */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center gap-2">
        {job.status === 'open' ? (
          <button
            onClick={() => onApply(job)}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <Send size={14} /> {tx.applyBtn}
          </button>
        ) : (
          <button disabled className="btn flex-1 bg-gray-100 text-gray-400 cursor-not-allowed text-sm">
            <XCircle size={14} className="me-1" /> {tx.closedBtn}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function PublicJobsPage() {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('public_lang');
    return stored === 'en' ? 'en' : 'ar';
  });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'closed'>('all');
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  const tx = TEXTS[lang];
  const dir = tx.dir;

  const toggleLang = () => {
    const next: Lang = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    localStorage.setItem('public_lang', next);
  };

  const { data: jobsResponse, isLoading, isError } = useQuery({
    queryKey: ['publicJobs'],
    queryFn: getAvailableJobs
  });

  const jobsData: Job[] = jobsResponse?.data || [];

  const filtered = jobsData.filter(job => {
    const q = search.toLowerCase();
    const matchSearch =
      job.job_title.toLowerCase().includes(q) ||
      (job.department && job.department.toLowerCase().includes(q));
    const matchFilter =
      filterType === 'all' ||
      (filterType === 'available' && job.status === 'open') ||
      (filterType === 'closed' && job.status !== 'open');
    return matchSearch && matchFilter;
  });

  return (
    <div
      dir={dir}
      className="min-h-screen"
      style={{ background: '#f1f5f9', fontFamily: tx.font }}
    >
      {/* ── Top Nav ─── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#4A7C59] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base sm:text-lg">🏢</span>
            </div>
            <div className="min-w-0 hidden xs:block sm:block">
              <p className="font-extrabold text-[#4A4E4A] text-xs sm:text-sm leading-tight truncate">{tx.brand}</p>
              <p className="text-[10px] text-[#6B6358] hidden sm:block">{tx.portal}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm cursor-pointer duration-200 h-8 sm:h-9"
            >
              <span className={lang === 'en' ? 'text-[#4A7C59] font-bold' : 'text-gray-400'}>EN</span>
              <span className="text-gray-300 font-normal">|</span>
              <span className={`font-tajawal text-[13px] leading-none ${lang === 'ar' ? 'text-[#4A7C59] font-bold' : 'text-gray-400'}`}>ع</span>
            </button>
            {/* Login */}
            <a
              href="/login"
              className="btn btn-primary text-xs gap-1.5 px-3 sm:px-5"
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">{tx.loginBtn}</span>
              <span className="sm:hidden">HR</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4A7C59 0%, #3a6347 50%, #2e4f38 100%)' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 end-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#C4A66A', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 start-0 w-36 h-36 sm:w-64 sm:h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: '#C4A66A', transform: 'translate(-30%, 30%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 leading-snug px-2">
            {tx.hero1}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-7 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
            {tx.hero2}
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto px-2 sm:px-0">
            <Search
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-[#6B6358] ${dir === 'rtl' ? 'right-5' : 'left-5'}`}
            />
            <input
              className={`w-full rounded-xl border-0 bg-white/95 shadow-lg py-3 sm:py-3.5 text-sm text-[#4A4E4A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50
                ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              placeholder={tx.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>


        </div>
      </div>

      {/* ── Content ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div>
            <h2 className="font-extrabold text-[#4A4E4A] text-lg sm:text-xl">{tx.sectionTitle}</h2>
            <p className="text-xs sm:text-sm text-[#6B6358] mt-0.5">
              {tx.results(filtered.length, search)}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 bg-white border border-gray-200 p-1 rounded-xl shadow-sm self-start sm:self-auto">
            {([
              { key: 'all' as const, label: tx.filterAll },
              { key: 'available' as const, label: tx.filterOpen },
              { key: 'closed' as const, label: tx.filterClosed },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === f.key
                  ? 'bg-[#4A7C59] text-white shadow-sm'
                  : 'text-[#6B6358] hover:text-[#4A4E4A]'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-16 sm:py-20 text-[#6B6358] flex flex-col items-center">
            <Loader2 size={32} className="animate-spin mb-3 text-[#4A7C59]" />
            <p>Loading jobs...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16 sm:py-20 text-red-500">
            <p>Failed to load jobs. Please try again later.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-[#4A4E4A] mb-1 text-sm sm:text-base">{tx.emptyTitle}</h3>
            <p className="text-xs sm:text-sm text-[#6B6358]">{tx.emptyDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} lang={lang} onApply={setApplyJob} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 sm:mt-12 text-center border-t border-gray-200 pt-6 sm:pt-8">
          <p className="text-xs text-[#6B6358]">
            {tx.footerEmployee}{' '}
            <a href="/login" className="text-[#4A7C59] font-bold hover:underline">
              {tx.footerLogin}
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-1">{tx.footerNote}</p>
        </div>
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <ApplyModal job={applyJob} lang={lang} onClose={() => setApplyJob(null)} />
      )}
    </div>
  );
}
