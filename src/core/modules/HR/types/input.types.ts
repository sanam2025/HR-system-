// shared/types/input.types.ts
/**
 * Props الخاصة بـ SearchInput Component
 */
export interface SearchInputProps {
  /** قيمة حقل البحث */
  value: string;
  /** دالة تغيير القيمة */
  onChange: (value: string) => void;
  /** النص الداخلي للحقل */
  placeholder?: string;
  /** كلاسات CSS إضافية */
  className?: string;
  /** تعطيل الحقل */
  disabled?: boolean;
  /** عرض أيقونة البحث */
  showIcon?: boolean;
  /** دالة التنفيذ عند الضغط على Enter */
  onSearch?: (value: string) => void;
  /** حجم الحقل */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props الخاصة بـ TextInput Component العام
 */
export interface TextInputProps {
  /** قيمة الحقل */
  value: string;
  /** دالة تغيير القيمة */
  onChange: (value: string) => void;
  /** نوع الحقل (text, email, password, etc) */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  /** عنوان الحقل */
  label?: string;
  /** النص المساعد */
  placeholder?: string;
  /** رسالة الخطأ */
  error?: string;
  /** هل الحقل مطلوب */
  required?: boolean;
  /** تعطيل الحقل */
  disabled?: boolean;
  /** أيقونة على اليمين */
  rightIcon?: React.ReactNode;
  /** أيقونة على اليسار */
  leftIcon?: React.ReactNode;
  /** كلاسات CSS إضافية */
  className?: string;
  /** دالة التنفيذ عند تغيير القيمة */
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}