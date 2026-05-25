// core/modules/HR/types/hr-components.types.ts
import  type{ Employee, EmployeeStatus } from './employee.types';
import  type{ SelectOption } from '../types/select.types';

/**
 * Props الخاصة بـ EmployeeStatusBadge Component
 */
export interface EmployeeStatusBadgeProps {
  /** حالة الموظف */
  status: EmployeeStatus;
  /** حجم البادج */
  size?: 'small' | 'medium' | 'large';
  /** عرض مع نص توضيحي */
  showLabel?: boolean;
  /** كلاسات CSS إضافية */
  className?: string;
}

/**
 * Props الخاصة بـ EmployeeFilters Component
 */
export interface EmployeeFiltersProps {
  /** قيمة البحث */
  searchTerm: string;
  /** دالة تغيير البحث */
  onSearchChange: (value: string) => void;
  /** فلتر القسم */
  departmentFilter: string;
  /** دالة تغيير فلتر القسم */
  onDepartmentChange: (value: string) => void;
  /** فلتر الحالة */
  statusFilter: string;
  /** دالة تغيير فلتر الحالة */
  onStatusChange: (value: string) => void;
  /** قائمة الأقسام المتاحة */
  departments: SelectOption[];
  /** تفعيل فلتر المسمى الوظيفي */
  showJobTitleFilter?: boolean;
  /** قيمة فلتر المسمى الوظيفي */
  jobTitleFilter?: string;
  /** دالة تغيير فلتر المسمى الوظيفي */
  onJobTitleChange?: (value: string) => void;
  /** كلاسات CSS إضافية */
  className?: string;
  /** عرض الفلاتر في صف واحد */
  inline?: boolean;
}

/**
 * Props الخاصة بـ EmployeeActions Component
 */
export interface EmployeeActionsProps {
  /** بيانات الموظف */
  employee: Employee;
  /** دالة العرض */
  onView?: (employee: Employee) => void;
  /** دالة التعديل */
  onEdit?: (employee: Employee) => void;
  /** دالة الحذف */
  onDelete?: (employee: Employee) => void;
  /** دالة التفعيل/إلغاء التفعيل */
  onToggleStatus?: (employee: Employee) => void;
  /** إظهار أزرار إضافية */
  showExtendedActions?: boolean;
  /** كلاسات CSS إضافية */
  className?: string;
  /** اتجاه الأزرار */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Props الخاصة بـ EmployeeForm Component (لإضافة/تعديل موظف)
 */
export interface EmployeeFormProps {
  /** بيانات الموظف (في حالة التعديل) */
  initialData?: Employee;
  /** دالة الحفظ */
  onSubmit: (data: Partial<Employee>) => void;
  /** دالة الإلغاء */
  onCancel: () => void;
  /** هل الفورم في حالة تحميل */
  isLoading?: boolean;
  /** قائمة الأقسام المتاحة */
  departments: SelectOption[];
  /** قائمة المسميات الوظيفية المتاحة */
  jobTitles: SelectOption[];
}

/**
 * Props الخاصة بـ EmployeeCard Component (عرض الموظف كبطاقة)
 */
export interface EmployeeCardProps {
  /** بيانات الموظف */
  employee: Employee;
  /** دالة النقر على البطاقة */
  onClick?: (employee: Employee) => void;
  /** عرض الإجراءات */
  showActions?: boolean;
  /** دالة التعديل */
  onEdit?: (employee: Employee) => void;
  /** دالة الحذف */
  onDelete?: (employee: Employee) => void;
  /** كلاسات CSS إضافية */
  className?: string;
  /** عرض البريد الإلكتروني */
  showEmail?: boolean;
}