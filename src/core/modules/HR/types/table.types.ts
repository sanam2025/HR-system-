// shared/types/table.types.ts
import type { ReactNode } from 'react';

/**
 * تعريف عمود في الجدول
 * @template T - نوع البيانات المعروضة في الجدول
 */
export interface Column<T > {
  /** مفتاح العمود (اسم الحقل في البيانات) */
  key: keyof T | string;
  /** عنوان العمود الذي يظهر في رأس الجدول */
  header: string;
  /** دالة مخصصة لعرض المحتوى (اختياري) */
  render?: (item: T) => ReactNode;
  /** كلاسات CSS إضافية للعمود */
  className?: string;
  /** عرض العمود في الشاشات الصغيرة */
  hideOnMobile?: boolean;
}

/**
 * Props الخاصة بـ DataTable Component
 * @template T - نوع البيانات المعروضة في الجدول
 */
export interface DataTableProps<T> {
  /** مصفوفة البيانات المراد عرضها */
  data: T[];
  /** تعريف الأعمدة */
  columns: Column<T>[];
  /** دالة تنفذ عند النقر على صف */
  onRowClick?: (item: T) => void;
  /** كلاسات CSS إضافية */
  className?: string;
  /** رسالة عند عدم وجود بيانات */
  emptyMessage?: string;
  /** تفعيل التظليل عند المرور على الصف */
  hoverable?: boolean;
  /** تفعيل الحدود بين الصفوف */
  bordered?: boolean;
}

/**
 * Props الخاصة بـ TablePagination Component
 */
export interface PaginationProps {
  /** عدد العناصر في كل صفحة */
  pageSize: number;
  /** عدد الصفحات الكلي */
  totalPages: number;
  /** الصفحة الحالية */
  currentPage: number;
  /** دالة تغيير الصفحة */
  onPageChange: (page: number) => void;
  /** دالة تغيير عدد العناصر في الصفحة */
  onPageSizeChange?: (size: number) => void;
  /** خيارات حجم الصفحة */
  pageSizeOptions?: number[];
}