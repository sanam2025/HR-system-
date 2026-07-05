// واجهة عرض التعميمات النشطة — تُوضع في أعلى الـ Dashboard
// تختفي تلقائياً إذا لم توجد تعميمات نشطة (لا عنوان ولا مساحة فارغة)

import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, Info } from 'lucide-react';
import { getActiveAnnouncements } from '../../../../api/announcements';
import type { Announcement } from '../../../../api/announcements';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';

// أيقونة + ألوان حسب الأولوية
const PRIORITY_CONFIG = {
  urgent: {
    icon: AlertTriangle,
    card:  'bg-red-50   border-red-200   text-red-800',
    badge: 'bg-red-100  text-red-700',
    dot:   'bg-red-500',
    key: 'urgent',
  },
  normal: {
    icon: Bell,
    card:  'bg-yellow-50 border-yellow-200 text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-700',
    dot:   'bg-yellow-500',
    key: 'normal',
  },
  info: {
    icon: Info,
    card:  'bg-blue-50  border-blue-200   text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    dot:   'bg-green-500',
    key: 'info',
  },
} as const;

export default function ActiveAnnouncements() {
  const { t, lang } = useLanguage();
  const [list,    setList]    = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveAnnouncements()
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // القسم يختفي كاملاً إذا لا يوجد تعميمات أو لا يزال يُحمَّل
  if (loading || list.length === 0) return null;

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-lg font-bold text-dark flex items-center gap-2">
        <span>📢</span> {t.announcements.activeTitle}
      </h2>
      <div className="space-y-3">
        {list.map(ann => {
        const cfg  = PRIORITY_CONFIG[ann.priority] ?? PRIORITY_CONFIG.info;
        const Icon = cfg.icon;
        const dateLabel = new Date(ann.starts_at).toLocaleDateString(
          lang === 'ar' ? 'ar-EG' : 'en-US',
          { year: 'numeric', month: 'short', day: 'numeric' },
        );

        return (
          <div
            key={ann.id}
            className={`flex items-start gap-3 rounded-2xl border p-4 ${cfg.card}`}
          >
            {/* أيقونة الأولوية */}
            <div className="shrink-0 mt-0.5">
              <Icon size={20} />
            </div>

            {/* المحتوى */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {/* شارة الأولوية */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  {t.announcements.priorities[cfg.key as keyof typeof t.announcements.priorities]}
                </span>
                <h3 className="text-sm font-bold">{ann.title}</h3>
              </div>
              <p className="text-xs leading-relaxed opacity-80">{ann.body}</p>
              <p className="text-[11px] opacity-60 mt-1">📅 {dateLabel}</p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
