export const TASK_STATUS_COLORS: Record<string, string> = {
  'جديدة': 'bg-blue-50 text-blue-700',
  'قيد التنفيذ': 'bg-yellow-50 text-yellow-700',
  'مكتملة': 'bg-green-50 text-green-700',
  'متأخرة': 'bg-red-50 text-red-600',
};export const TASK_STATUS_EN: Record<string, string> = {
  'جديدة': 'New',
  'قيد التنفيذ': 'In Progress',
  'مكتملة': 'Completed',
  'متأخرة': 'Late',
};export const CHART_MONTHS_EN: Record<string, string> = {
  'يناير': 'Jan',
  'فبراير': 'Feb',
  'مارس': 'Mar',
  'أبريل': 'Apr',
  'مايو': 'May',
  'يونيو': 'Jun',
  'يوليو': 'Jul',
  'أغسطس': 'Aug',
  'سبتمبر': 'Sep',
  'أكتوبر': 'Oct',
  'نوفمبر': 'Nov',
  'ديسمبر': 'Dec',
};export const ATTENDANCE_STATUS_INFO: Record<string, { labelAr: string; labelEn: string; colorClass: string }> = {
  'حاضر':    { labelAr: 'حاضر',  labelEn: 'Present',  colorClass: 'bg-green-50 text-green-700 border border-green-200' },
  'غائب':    { labelAr: 'غائب',  labelEn: 'Absent',   colorClass: 'bg-red-50 text-red-600 border border-red-200' },
  'تأخير':   { labelAr: 'تأخير', labelEn: 'Late',     colorClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  'إجازة':   { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },  'Present': { labelAr: 'حاضر',  labelEn: 'Present',  colorClass: 'bg-green-50 text-green-700 border border-green-200' },
  'present': { labelAr: 'حاضر',  labelEn: 'Present',  colorClass: 'bg-green-50 text-green-700 border border-green-200' },
  'Absent':  { labelAr: 'غائب',  labelEn: 'Absent',   colorClass: 'bg-red-50 text-red-600 border border-red-200' },
  'absent':  { labelAr: 'غائب',  labelEn: 'Absent',   colorClass: 'bg-red-50 text-red-600 border border-red-200' },
  'Late':    { labelAr: 'تأخير', labelEn: 'Late',     colorClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  'late':    { labelAr: 'تأخير', labelEn: 'Late',     colorClass: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
  'Leave':   { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'leave':   { labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'On Leave':{ labelAr: 'إجازة', labelEn: 'On Leave', colorClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
};
