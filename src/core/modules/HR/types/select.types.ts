// shared/types/select.types.ts
import type { ReactNode } from 'react';

/**
 * خيار في القائمة المنسدلة
 */
export interface SelectOption {
  /** قيمة الخيار */
  value: string;
  /** النص المعروض للخيار */
  label: string;
  /** تعطيل الخيار */
  disabled?: boolean;
  /** أيقونة الخيار */
  icon?: ReactNode;
}

/**
 * Props الخاصة بـ FilterSelect Component
 */
export interface FilterSelectProps {
  /** القيمة المحددة حالياً */
  value: string;
  /** دالة تغيير القيمة */
  onChange: (value: string) => void;
  /** مصفوفة الخيارات */
  options: SelectOption[];
  /** النص الافتراضي (الكل) */
  placeholder?: string;
  /** كلاسات CSS إضافية */
  className?: string;
  /** تعطيل القائمة */
  disabled?: boolean;
  /** هل القائمة مطلوبة */
  required?: boolean;
  /** عنوان القائمة */
  label?: string;
  /** رسالة الخطأ */
  error?: string;
}

/**
 * Props الخاصة بـ MultiSelect Component
 */
export interface MultiSelectProps {
  /** القيم المحددة */
  values: string[];
  /** دالة تغيير القيم */
  onChange: (values: string[]) => void;
  /** مصفوفة الخيارات */
  options: SelectOption[];
  /** النص الافتراضي */
  placeholder?: string;
  /** كلاسات CSS إضافية */
  className?: string;
  /** الحد الأقصى للاختيارات */
  maxSelections?: number;
  /** إمكانية البحث داخل الخيارات */
  searchable?: boolean;
}