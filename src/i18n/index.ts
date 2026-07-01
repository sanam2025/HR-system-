// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // ✅ القائمة الجانبية
      dashboard: 'Dashboard',
      employee: 'Employee',
      recruitment: 'Recruitment',
      applicants: 'Applicants',
      attendance: 'Attendance',
      leaves: 'Leaves',
      hourlyLeaves: 'Hourly Leaves',
      payroll: 'Payroll',
      acceptedCandidates: 'Accepted Candidates',
      terminations: 'Terminations',
      resignations: 'Resignations',
      contracts: 'Contracts',
      jobPostings: 'Job Postings',
      interviews: 'Interviews',
      
      // ✅ الصفحات
      allApplicants: 'All Applicants',
      noApplicants: 'No applicants found for this job posting',
      noApplicantsApplied: 'No applicants have applied for this position yet.',
      backToRecruitment: 'Back to Recruitment',
      
      // ✅ الأزرار
      scheduleInterview: 'Schedule Interview',
      viewDetails: 'View Details',
      approve: 'Approve',
      reject: 'Reject',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      refresh: 'Refresh',
      search: 'Search',
      
      // ✅ الحالات
      status: 'Status',
      pending: 'Pending',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected',
      applied: 'Applied',
      interviewed: 'Interviewed',
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      open: 'Open',
      closed: 'Closed',
      
      // ✅ الجدول
      applicant: 'Applicant',
      contact: 'Contact',
      experience: 'Experience',
      skills: 'Skills',
      appliedDate: 'Applied Date',
      actions: 'Actions',
      jobTitle: 'Job Title',
      department: 'Department',
      requester: 'Requester',
      exp: 'Exp',
      
      // ✅ المقابلات
      manageInterviews: 'Manage interviews for this job posting',
      candidate: 'Candidate',
      scheduledAt: 'Scheduled At',
      location: 'Location',
      interviewer: 'Interviewer',
      total: 'Total',
      
      // ✅ عام
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      noData: 'No data found',
      noResults: 'No results found',
      
      // ✅ الإعدادات
      settings: 'Settings',
      language: 'Language',
      arabic: 'Arabic',
      english: 'English',
    },
  },
  ar: {
    translation: {
      // ✅ القائمة الجانبية
      dashboard: 'لوحة التحكم',
      employee: 'الموظفين',
      recruitment: 'التوظيف',
      applicants: 'المتقدمين',
      attendance: 'الحضور',
      leaves: 'الإجازات',
      hourlyLeaves: 'إجازات ساعات',
      payroll: 'الرواتب',
      acceptedCandidates: 'المرشحين المقبولين',
      terminations: 'إنهاء الخدمة',
      resignations: 'الاستقالات',
      contracts: 'العقود',
      jobPostings: 'الوظائف المعلنة',
      interviews: 'المقابلات',
      
      // ✅ الصفحات
      allApplicants: 'جميع المتقدمين',
      noApplicants: 'لا يوجد متقدمين لهذه الوظيفة',
      noApplicantsApplied: 'لم يتقدم أي شخص لهذه الوظيفة بعد.',
      backToRecruitment: 'العودة لطلبات التوظيف',
      
      // ✅ الأزرار
      scheduleInterview: 'جدولة مقابلة',
      viewDetails: 'عرض التفاصيل',
      approve: 'موافقة',
      reject: 'رفض',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      refresh: 'تحديث',
      search: 'بحث',
      
      // ✅ الحالات
      status: 'الحالة',
      pending: 'قيد الانتظار',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض',
      applied: 'مقدم',
      interviewed: 'تمت المقابلة',
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغية',
      open: 'مفتوحة',
      closed: 'مغلقة',
      
      // ✅ الجدول
      applicant: 'المتقدم',
      contact: 'جهة الاتصال',
      experience: 'الخبرة',
      skills: 'المهارات',
      appliedDate: 'تاريخ التقديم',
      actions: 'الإجراءات',
      jobTitle: 'المسمى الوظيفي',
      department: 'القسم',
      requester: 'الطالب',
      exp: 'خبرة',
      
      // ✅ المقابلات
      manageInterviews: 'إدارة المقابلات لهذه الوظيفة',
      candidate: 'المرشح',
      scheduledAt: 'وقت المقابلة',
      location: 'المكان',
      interviewer: 'المحاور',
      total: 'الإجمالي',
      
      // ✅ عام
      loading: 'جاري التحميل...',
      error: 'خطأ',
      tryAgain: 'حاول مرة أخرى',
      noData: 'لا توجد بيانات',
      noResults: 'لا توجد نتائج',
      
      // ✅ الإعدادات
      settings: 'الإعدادات',
      language: 'اللغة',
      arabic: 'العربية',
      english: 'الإنجليزية',
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;