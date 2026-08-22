
import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Info, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AnnouncementsService } from '../../../../api/service/HrService/AnnouncementsService';
import { useLanguage } from '../../../../i18n/translations/LanguageContext';const PRIORITY_CONFIG: Record<string, {
  icon: typeof AlertTriangle;
  card: string;
  badge: string;
  dot: string;
  labelKey: 'high' | 'medium' | 'low';
  weight: number;
}> = {
  high: {
    icon: AlertTriangle,
    card:  'bg-red-50   border-red-200   text-red-800',
    badge: 'bg-red-100  text-red-700',
    dot:   'bg-red-500',
    labelKey: 'high',
    weight: 3,
  },
  urgent: {
    icon: AlertTriangle,
    card:  'bg-red-50   border-red-200   text-red-800',
    badge: 'bg-red-100  text-red-700',
    dot:   'bg-red-500',
    labelKey: 'high',
    weight: 3,
  },
  medium: {
    icon: Bell,
    card:  'bg-yellow-50 border-yellow-200 text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-700',
    dot:   'bg-yellow-500',
    labelKey: 'medium',
    weight: 2,
  },
  normal: {
    icon: Bell,
    card:  'bg-yellow-50 border-yellow-200 text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-700',
    dot:   'bg-yellow-500',
    labelKey: 'medium',
    weight: 2,
  },
  low: {
    icon: Info,
    card:  'bg-blue-50  border-blue-200   text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    dot:   'bg-green-500',
    labelKey: 'low',
    weight: 1,
  },
  info: {
    icon: Info,
    card:  'bg-blue-50  border-blue-200   text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
    dot:   'bg-green-500',
    labelKey: 'low',
    weight: 1,
  },
};

const DEFAULT_CFG = { ...PRIORITY_CONFIG.low, weight: 0 };

export default function ActiveAnnouncements() {
  const { t, lang } = useLanguage();  const [dismissedIds, setDismissedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('dismissed_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const handleDismiss = (id: number) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed));
  };  const { data, isLoading } = useQuery({
    queryKey: ['active-announcements'],
    queryFn:  () => AnnouncementsService.getActive(),
    refetchInterval: 60_000, // تحديث كل دقيقة
    retry: false,
  });

  const rawList = data?.data?.data ?? data?.data ?? [];
  let list = Array.isArray(rawList) ? rawList : [];  list = list
    .filter((a: any) => !dismissedIds.includes(a.id))
    .sort((a: any, b: any) => {
      const weightA = PRIORITY_CONFIG[a.priority]?.weight ?? 0;
      const weightB = PRIORITY_CONFIG[b.priority]?.weight ?? 0;      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });  if (isLoading || list.length === 0) return null;

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-lg font-bold text-dark flex items-center gap-2">
        <span>📢</span> {t.announcements.activeTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((ann: any) => {
          const cfg  = PRIORITY_CONFIG[ann.priority] ?? DEFAULT_CFG;
          const Icon = cfg.icon;
          const dateLabel = new Date(ann.starts_at).toLocaleDateString(
            lang === 'ar' ? 'ar-EG' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' },
          );
          const body = ann.content ?? ann.body ?? '';

          return (
            <div
              key={ann.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 relative ${cfg.card} shadow-sm hover:shadow-md transition-shadow`}
            >              <button 
                onClick={() => handleDismiss(ann.id)}
                className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-1 rounded-full hover:bg-black/5 transition-colors"
                title={lang === 'ar' ? 'إخفاء' : 'Dismiss'}
              >
                <X size={16} className="opacity-70" />
              </button>              <div className="flex gap-3">                <div className="shrink-0 mt-0.5">
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0 pr-6 rtl:pr-0 rtl:pl-6">
                  <div className="flex flex-wrap items-center gap-2 mb-1">                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {(t.announcements.priorities as any)[ann.priority] ?? ann.priority}
                    </span>
                    <h3 className="text-sm font-bold truncate">{ann.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed opacity-85 line-clamp-3">{body}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 flex justify-between items-center text-[11px] opacity-60">
                <span>📅 {dateLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
