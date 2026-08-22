import type { ReactNode } from 'react';

/**
 * نوع لون زر الإجراء
 */
export type ActionVariant = 'primary' | 'danger' | 'warning' | 'success' | 'info';

/**
 * تعريف إجراء واحد (زر)
 */
export interface Action {
  /** نص الإجراء */
  label: string;
  /** أيقونة الإجراء */
  icon?: ReactNode;
  /** دالة تنفذ عند النقر */
  onClick: () => void;
  /** لون الإجراء */
  variant?: ActionVariant;
  /** تعطيل الزر */
  disabled?: boolean;
  /** نص مساعد يظهر عند التحويم */
  title?: string;
  /** تأكيد قبل التنفيذ */
  confirmMessage?: string;
}

/**
 * Props الخاصة بـ ActionButtons Component
 */
export interface ActionButtonsProps {
  /** مصفوفة الإجراءات */
  actions: Action[];
  /** عرض النص بجانب الأيقونة */
  showLabel?: boolean;
  /** كلاسات CSS إضافية */
  className?: string;
  /** ترتيب الأزرار عمودي */
  vertical?: boolean;
  /** حجم الأزرار */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props الخاصة بـ ConfirmDialog Component
 */
export interface ConfirmDialogProps {
  /** هل الحوار مفتوح */
  isOpen: boolean;
  /** عنوان الحوار */
  title: string;
  /** نص الرسالة */
  message: string;
  /** نص زر التأكيد */
  confirmText?: string;
  /** نص زر الإلغاء */
  cancelText?: string;
  /** لون زر التأكيد */
  confirmVariant?: ActionVariant;
  /** دالة التأكيد */
  onConfirm: () => void;
  /** دالة الإلغاء */
  onCancel: () => void;
}