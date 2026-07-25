const ar = {
// ── Navigation ─
  nav: {
    dashboard: 'لوحة التحكم',
    employees: 'الموظفون',
    tasks: 'المهام',
    leaves: 'الإجازات',
    overtime: 'العمل الإضافي',
    attendance: 'الحضور',
    evaluation: 'التقييم الدوري',
    recruitment: 'التوظيف',
    interviews: 'المقابلات',
    mainMenu: 'القائمة الرئيسية',
  },

  // ── Common ──
  common: {
    viewAll: 'عرض الكل',
    days: 'أيام',
    approve: 'موافقة',
    reject: 'رفض',
  },

  // ── Dashboard ──
  dashboard: {
    totalEmployees: 'إجمالي الموظفين',
    presentToday: 'حاضر اليوم',
    avgPerformance: 'متوسط الأداء',
    outOf: 'من 5',
    attendanceRate: 'نسبة الحضور',
    thisMonth: 'هذا الشهر',
    pendingTasks: 'مهام قيد الانتظار',
    completedThisMonth: 'مكتملة هذا الشهر',
    performanceChart: '📈 أداء القسم الشهري',
    avgRating: 'متوسط التقييم',
    attendanceChart: '📊 نسبة الحضور الشهرية',
    attendancePct: 'نسبة الحضور %',
    pendingTasksList: '⏳ المهام المعلقة',
    pendingLeavesList: '📋 طلبات الإجازة المعلقة',
    noPendingLeaves: 'لا توجد طلبات معلقة',
    pendingLeaves: 'طلبات إجازة معلقة',
    pendingOvertime: 'طلبات عمل إضافي',
    completedTasks: 'مهام مكتملة هذا الشهر',
    presentEmployees: 'موظفون حاضرون'
  },

  
  // ── Sidebar / Topbar ──
  layout: {
    systemName: 'HR System',
    university: 'جامعة دمشق',
    managerRole: 'مدير القسم',
    userName: 'Mohamed Ahmed',
    userAvatar: 'M',
  },

  // ── Tasks ──
  tasks: {
    boardTitle: 'لوحة المهام',
    activeTasks: 'مهمة إجمالية',
    newTask: 'مهمة جديدة',
    columns: {
      new: 'جديدة',
      inProgress: 'قيد التنفيذ',
      completed: 'مكتملة',
      late: 'متأخرة',
    },
    noTasks: 'لا توجد مهام',
    rateTask: 'تقييم المهمة',
    createModal: {
      title: 'إنشاء مهمة جديدة',
      taskTitle: 'عنوان المهمة',
      taskTitlePlaceholder: 'أدخل عنوان المهمة...',
      assignee: 'المُسند إليه',
      selectEmployee: 'اختر الموظف...',
      priority: 'الأولوية',
      dueDate: 'تاريخ الاستحقاق',
      description: 'الوصف',
      descriptionPlaceholder: 'وصف تفصيلي للمهمة...',
      cancel: 'إلغاء',
      createBtn: 'إنشاء وتعيين المهمة',
      requiredError: 'يرجى ملء جميع الحقول المطلوبة',
      success: 'تم إنشاء المهمة بنجاح',
    },
    rateModal: {
      title: 'تقييم المهمة',
      rating: 'التقييم',
      notes: 'ملاحظات',
      notesPlaceholder: 'أضف تعليقات حول الأداء...',
      saveBtn: 'حفظ التقييم',
      cancel: 'إلغاء',
      error: 'يرجى اختيار تقييم للمهمة',
      success: 'تم تقييم المهمة بنجاح',
      ratings: {
        poor: 'ضعيف',
        fair: 'مقبول',
        good: 'جيد',
        veryGood: 'جيد جداً',
        excellent: 'ممتاز'
      }
    },
    priorities: {
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة'
    }
  },

  // ── Employees ──
  employees: {
    listTitle: 'قائمة الموظفين',
    employeesCount: 'موظف',
    searchPlaceholder: 'ابحث عن موظف...',
    filterAll: 'الكل',
    status: {
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر',
      leave: 'إجازة'
    },
    noEmployees: 'لا يوجد موظفين',
    tryChanging: 'حاول تغيير كلمة البحث أو الفلتر',
    tasks: 'مهام',
    leaves: 'إجازات'
  },

  // ── Employee Profile ──
  employeeProfile: {
    notFound: 'الموظف غير موجود',
    back: 'رجوع',
    backToList: 'العودة للقائمة',
    today: 'اليوم',
    joinDate: 'تاريخ الانضمام:',
    leaveBalance: 'رصيد الإجازات',
    days: 'أيام',
    totalTasks: 'إجمالي المهام',
    avgRating: 'متوسط التقييم',
    activeTasks: 'المهام النشطة',
    noTasks: 'لا توجد مهام مسندة',
    dueDate: 'تاريخ الاستحقاق:',
    attendanceRecord: 'سجل الحضور',
    checkIn: 'دخول:',
    checkOut: '— خروج:',
    delay: 'تأخير',
    mins: 'دقيقة'
  },

  // ── Leaves ──
  leaves: {
    title: 'الإجازات',
    pendingReview: 'طلبات معلقة بانتظار مراجعتك',
    pendingAttention: 'طلبات معلقة تحتاج لاهتمامك',
    mainTabs: {
      teamLeaves: 'إجازات الفريق',
      myLeaves: 'إجازاتي'
    },
    myLeaves: {
      newRequest: 'طلب إجازة جديد',
      form: {
        title: 'تقديم طلب إجازة',
        type: 'نوع الإجازة',
        startDate: 'تاريخ البدء',
        date: 'التاريخ',
        daysCount: 'عدد الأيام',
        startTime: 'وقت البدء',
        endTime: 'وقت الانتهاء',
        reason: 'السبب',
        submit: 'تقديم الطلب',
        submitting: 'جاري التقديم...',
        cancel: 'إلغاء'
      },
      status: {
        pending: 'قيد المراجعة',
        approved: 'تمت الموافقة',
        rejected: 'مرفوض'
      },
      toast: {
        success: 'تم تقديم طلب الإجازة بنجاح'
      }
    },
    tabs: {
      all: 'الكل',
      pending: 'معلقة',
      approved: 'مقبولة',
      rejected: 'مرفوضة'
    },
    types: {
      annual: 'سنوية',
      sick: 'مرضية',
      emergency: 'اضطرارية',
      unpaid: 'غير مدفوعة'
    },
    dailyToggle: 'إجازة يومية',
    hourlyToggle: 'مغادرة (ساعيّة)',
    noRequests: 'لا توجد طلبات',
    requestedOn: 'تاريخ الطلب:',
    days: 'أيام',
    reason: 'السبب:',
    remainingBalance: 'الرصيد المتبقي:',
    insufficientBalance: '(رصيد غير كافٍ)',
    approveBtn: 'موافقة',
    rejectBtn: 'رفض',
    confirmModal: {
      approveTitle: 'تأكيد الموافقة',
      rejectTitle: 'تأكيد الرفض',
      approveDesc: 'هل أنت متأكد أنك تريد الموافقة على طلب الإجازة هذا؟ لا يمكن التراجع عن هذا الإجراء.',
      rejectDesc: 'هل أنت متأكد أنك تريد رفض طلب الإجازة هذا؟ لا يمكن التراجع عن هذا الإجراء.',
      confirm: 'تأكيد',
      cancel: 'إلغاء'
    },
    toast: {
      approved: 'تمت الموافقة على الطلب بنجاح',
      rejected: 'تم رفض الطلب بنجاح'
    }
  },

  // ── Overtime ──
  overtime: {
    title: 'طلبات العمل الإضافي',
    subtitle: 'طلبات معلقة',
    pendingRequests: 'طلبات معلقة',
    pendingAlert: 'طلبات بانتظار اتخاذ إجراء',
    awaitingAction: 'طلبات بانتظار اتخاذ إجراء',
    tabs: {
      all: 'الكل',
      pending: 'معلقة',
      approved: 'مقبولة',
      rejected: 'مرفوضة'
    },
    noRequests: 'لا توجد طلبات عمل إضافي',
    requestedOn: 'تاريخ الطلب',
    hours: 'ساعات',
    hoursLabel: 'ساعات',
    date: 'التاريخ',
    dateLabel: 'التاريخ',
    reason: 'السبب',
    reasonLabel: 'السبب',
    approveBtn: 'موافقة',
    rejectBtn: 'رفض',
    confirmModal: {
      approveTitle: 'تأكيد الموافقة',
      rejectTitle: 'تأكيد الرفض',
      approveDesc: 'هل أنت متأكد أنك تريد الموافقة على طلب العمل الإضافي هذا؟ لا يمكن التراجع عن هذا الإجراء.',
      rejectDesc: 'هل أنت متأكد أنك تريد رفض طلب العمل الإضافي هذا؟ لا يمكن التراجع عن هذا الإجراء.',
      confirm: 'تأكيد',
      cancel: 'إلغاء'
    },
    toast: {
      approved: 'تمت الموافقة على الطلب بنجاح',
      rejected: 'تم رفض الطلب بنجاح'
    },
    toasts: {
      approved: 'تمت الموافقة على الطلب بنجاح',
      rejected: 'تم رفض الطلب بنجاح'
    }
  },

  // ── Attendance ──
  attendance: {
    title: 'نظرة عامة على الحضور',
    subtitle: 'تتبع سجلات حضور الموظفين',
    stats: {
      total: 'إجمالي الأيام',
      present: 'أيام الحضور',
      absent: 'أيام الغياب',
      late: 'أيام التأخير'
    },
    searchPlaceholder: 'ابحث عن الموظفين...',
    recordsTitle: 'سجلات الحضور:',
    tabs: {
      byEmployee: 'حسب الموظف',
      generalReport: 'تقرير الحضور العام'
    },
    filter: {
      fromDate: 'من تاريخ',
      toDate: 'إلى تاريخ',
      status: 'الحالة',
      all: 'الكل',
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر'
    },
    employeeCol: 'الموظف',
    columns: {
      date: 'التاريخ',
      status: 'الحالة',
      checkIn: 'دخول',
      checkOut: 'خروج',
      delay: 'التأخير (دقيقة)',
      earlyLeave: 'انصراف مبكر (دقيقة)'
    },
    noRecords: 'لا توجد سجلات حضور',
    min: 'دقيقة'
  },

  // ── Evaluation ──
  evaluation: {
    title: 'التقييم الدوري',
    subtitle: 'تقييم شامل للأداء، الحضور، والسلوك',
    errorIncomplete: 'يرجى ملء جميع الحقول وتقييم جميع المعايير',
    successMsg: 'تم إرسال التقييم بنجاح!',
    criteria: {
      performance: 'جودة الأداء والإنتاجية',
      attendance: 'الانضباط والحضور',
      behavior: 'السلوك المهني والتعامل',
      teamwork: 'العمل الجماعي والتعاون',
      initiative: 'المبادرة والإبداع'
    },
    successCard: {
      title: 'تم إرسال التقييم!',
      thankYou: 'شكراً لتقييمك للموظف',
      avgRating: 'متوسط التقييم العام',
      evaluateAnother: 'تقييم موظف آخر'
    },
    form: {
      selectEmployee: 'اختر الموظف *',
      selectPlaceholder: '-- اختر موظفاً --',
      evalMonth: 'شهر التقييم *',
      scaleHint: '1 = ضعيف  –  5 = ممتاز',
      avgRating: 'متوسط التقييم العام',
      notes: 'ملاحظات إضافية',
      notesPlaceholder: 'أضف ملاحظاتك التفصيلية حول أداء الموظف...',
      submit: 'إرسال التقييم لقسم الموارد البشرية'
    }
  },

  // ── Recruitment ──
  recruitment: {
    title: 'التوظيف والمرشحين',
    subtitle: 'إدارة الشواغر الوظيفية وتقييم المرشحين',
    tabVacancy: 'طلب شاغر وظيفي',
    tabCandidates: 'تقييم المرشحين',
    vacancy: {
      title: 'طلب شاغر وظيفي جديد',
      positionTitle: 'المسمى الوظيفي',
      positionPlaceholder: 'مثال: مطور واجهات أمامية...',
      description: 'الوصف الوظيفي',
      descriptionPlaceholder: 'اكتب وصفاً تفصيلياً للوظيفة والمهام المطلوبة...',
      experience: 'سنوات الخبرة المطلوبة',
      count: 'العدد المطلوب',
      reason: 'سبب الطلب',
      reasonPlaceholder: 'لماذا نحتاج هذا الشاغر؟',
      requirements: 'المتطلبات الأساسية',
      requirementsPlaceholder: 'المهارات والخبرات المطلوبة...',
      requirementsHint: 'اختر المهارات المطلوبة للوظيفة',
      selectSkill: '-- اختر مهارة --',
      customSkillPlaceholder: 'أو اكتب مهارة غير موجودة في القائمة...',
      addCustomSkillBtn: 'إضافة مهارة',
      deadline: 'تاريخ التوظيف المستهدف',
      submitBtn: 'إرسال الطلب للموارد البشرية',
      successTitle: 'تم إرسال الطلب!',
      successNote: 'طلبك للحصول على',
      successNote2: 'تم إرساله إلى قسم الموارد البشرية بنجاح.',
      sendAnother: 'إرسال طلب آخر',
      toasts: {
        fillAll: 'يرجى تعبئة المسمى الوظيفي وسبب الطلب',
        success: 'تم إرسال طلب الشاغر بنجاح'
      }
    },
    candidates: {
      title: 'ترتيب أفضل المرشحين',
      sendRanking: 'إرسال الترتيب النهائي',
      moveHint: 'استخدم الأسهم لترتيب المرشحين حسب الأفضلية.',
      experience: 'سنوات خبرة',
      interviewScore: 'تقييم المقابلة',
      cvScore: 'تقييم السيرة',
      communicationScore: 'مهارات التواصل',
      totalScore: 'المجموع الكلي',
      rateAllFirst: 'يرجى تقييم جميع المرشحين في المعايير الثلاثة قبل الإرسال',
      notRatedYet: 'لم يُقيّم بعد',
      liveRanking: 'الترتيب الحالي',
      tieHint: 'عند تساوي التقييم يمكنك تحديد الترتيب يدوياً بالأسهم',
      successTitle: 'تم إرسال الترتيب!',
      successNote: 'شكراً لك. سيقوم قسم الموارد البشرية باستكمال عروض العمل بناءً على تقييمك.',
      toasts: {
        success: 'تم إرسال تقييم المرشحين بنجاح'
      }
    }
  },
  interviews: {
    title: 'إدارة المقابلات',
    subtitle: 'مرشحون بانتظار التقييم · أدر النجوم وأرسل الترتيب النهائي',
    searchPlaceholder: 'ابحث عن مرشح...',
    candidatesCount: 'مرشح',
    ratedCount: 'تم تقييمه',
    rateAllWarning: 'قيّم جميع المرشحين بالنجوم لتتمكن من إرسال الترتيب النهائي',
    sendRanking: 'إرسال الترتيب النهائي',
    sendingRanking: 'جاري الإرسال...',
    rankingSent: 'تم الإرسال ✅',
    rankingPanel: 'الترتيب الحالي',
    rankingSubtitle: 'يتحدّث تلقائياً عند تغيير التقييم · في حالة التساوي يمكنك ترتيبهم يدوياً',
    readyToSend: '🎉 جميع المرشحين تم تقييمهم! يمكنك إرسال الترتيب النهائي الآن.',
    rankingDone: '✅ تم إرسال الترتيب النهائي بنجاح',
    interviewRating: 'تقييم المقابلة',
    notRatedYet: 'لم يُقيَّم بعد',
    notes: 'ملاحظات',
    yearsExp: 'سنوات خبرة',
    cvScore: 'CV Score',
    noResults: 'لا توجد نتائج مطابقة للبحث',
    statusPending: 'بانتظار المقابلة',
    statusDone: 'تم التقييم',
    statusRejected: 'مرفوض',
    toasts: {
      success: 'تم إرسال التقييمات والترتيب بنجاح ✅',
      error: 'حدث خطأ أثناء الإرسال، تأكد من اتصالك بالخادم',
      rateFirst: 'قيّم جميع المرشحين أولاً'
    }
  },
};

export default ar;