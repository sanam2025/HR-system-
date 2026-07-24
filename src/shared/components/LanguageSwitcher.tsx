// src/shared/components/LanguageSwitcher.tsx
import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/translations/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium uppercase">
        {lang === 'en' ? 'AR' : 'EN'}
      </span>
    </button>
  );
}