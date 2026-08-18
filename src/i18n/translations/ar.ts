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
    announcements: 'التعميمات',
    terminations: 'إنهاء الخدمة',
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

  // ── Announcements ──
  announcements: {
    title: 'إدارة التعميمات',
    subtitle: 'إنشاء ومتابعة التعميمات الخاصة بقسمك',
    createNew: 'إنشاء تعميم',
    activeTitle: 'الإعلانات',
    form: {
      createTitle: 'إنشاء تعميم جديد',
      editTitle: 'تعديل التعميم',
      titleLabel: 'عنوان التعميم',
      bodyLabel: 'نص التعميم',
      priorityLabel: 'الأولوية',
      startsAtLabel: 'تاريخ النشر',
      endsAtLabel: 'تاريخ الانتهاء (اختياري)',
      audienceNote: '📢 سيتم توجيه هذا التعميم تلقائياً لجميع موظفي قسمك.',
      saveBtn: 'حفظ التعميم',
      savingBtn: 'جاري الحفظ...',
      cancelBtn: 'إلغاء',
      fillRequired: 'يرجى ملء جميع الحقول المطلوبة',
      createdSuccess: 'تم إنشاء التعميم بنجاح ✅',
      updatedSuccess: 'تم تعديل التعميم بنجاح ✅',
    },
    list: {
      title: 'قائمة التعميمات',
      loading: 'جاري التحميل...',
      emptyMsg: 'لا توجد تعميمات حتى الآن',
      createFirst: '+ إنشاء أول تعميم',
      columns: {
        title: 'العنوان',
        audience: 'الجمهور',
        priority: 'الأولوية',
        status: 'الحالة',
        date: 'تاريخ النشر',
        actions: 'الإجراءات',
      },
      publishNow: 'نشر الآن',
      edit: 'تعديل',
      delete: 'حذف',
      publishedSuccess: 'تم النشر فوراً ✅',
      hrNote: 'لا يمكنك تعديل أو حذف تعميمات الموارد البشرية',
    },
    deleteConfirm: {
      title: 'تأكيد الحذف',
      desc: 'هل أنت متأكد من حذف التعميم "{title}"؟ لا يمكن التراجع عن هذا الإجراء.',
      yesBtn: 'نعم، احذف',
      cancelBtn: 'إلغاء',
      success: 'تم الحذف بنجاح',
    },
    priorities: {
      urgent: '🔴 عاجل',
      normal: '🟡 عادي',
      info: '🟢 إشعار عام',
      high:   '🔴 عاجل',
      medium: '🟡 عادي',
      low:    '🟢 إشعار عام',
    },
    audiences: {
      all: 'الكل',
      department: 'القسم',
      managers: 'المدراء',
    },
    statuses: {
      draft: 'مسودة',
      scheduled: 'مجدول',
      active: 'نشط',
      expired: 'منتهي',
    }
  },


  // ── Sidebar / Topbar ──
  layout: {
    systemName: 'HR System',
    university: 'جامعة دمشق',
    managerRole: 'مدير القسم',
    userName: 'Ahmad Front',
    userAvatar: 'A',
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
    reviewTask: 'مراجعة',
    completedThisMonth: 'مكتملة هذا الشهر',
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
    reviewModal: {
      title: 'مراجعة تسليم المهمة',
      submissionDetails: 'تفاصيل التسليم',
      notes: 'الملاحظة:',
      noNotes: 'لا توجد ملاحظات',
      attachment: 'الملف المرفق:',
      viewAttachment: 'عرض المرفق',
      noAttachment: 'لا يوجد مرفق لتسليم هذه المهمة',
      decision: 'القرار',
      approve: 'موافقة',
      reject: 'رفض',
      rejectNotice: 'سيتم إخطار الموظف برفض التسليم وإمكانية إعادة التقديم.',
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
    mins: 'دقيقة',
    contract: 'العقد',
    documents: 'المستندات',
    download: 'تحميل',
    noContract: 'لا يوجد عقد متاح',
    noDocuments: 'لا توجد مستندات مرفوعة',
    documentName: 'اسم المستند',
    dateAdded: 'تاريخ الإضافة',
    noAttendance: 'لا يوجد سجل حضور متاح حالياً',
    employmentContract: 'عقد العمل'
  },

  // ── Leaves ──
  leaves: {
    title: 'الإجازات',
    subtitle: 'إدارة طلبات الإجازات والمغادرات الساعية للقسم ولحسابك الشخصي',
    pendingReview: 'طلبات معلقة بانتظار مراجعتك',
    pendingAttention: 'طلبات معلقة تحتاج لاهتمامك',
    mainTabs: {
      teamLeaves: 'إجازات الفريق',
      myLeaves: 'إجازاتي'
    },
    myLeaves: {
      newRequest: 'طلب إجازة جديد',
      newHourlyRequest: 'طلب مغادرة ساعية جديدة',
      balanceTitle: 'رصيد الإجازات المتبقي',
      form: {
        title: 'تقديم طلب إجازة',
        hourlyTitle: 'طلب مغادرة ساعية',
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
    title: 'إدارة العمل الإضافي',
    subtitle: 'متابعة وتكليف ساعات العمل الإضافي لموظفي القسم',
    assignBtn: 'تكليف عمل إضافي',
    personalBtn: 'طلب إضافي شخصي',
    mainTabs: {
      department: 'طلبات القسم التطوعية',
      myCreated: 'التكاليف الصادرة منّي',
      myOwn: 'ساعاتي الإضافية الشخصية'
    },
    alerts: {
      pending: 'يوجد طلبات عمل إضافي بانتظار موافقتك.'
    },
    emptyStates: {
      department: 'لا توجد طلبات عمل إضافي حالياً بالقسم',
      myCreated: 'لم تقم بتكليف أي موظف بعمل إضافي بعد',
      myOwn: 'لا توجد ساعات عمل إضافية خاصة بك مسجلة'
    },
    card: {
      date: 'التاريخ:',
      time: 'التوقيت:',
      notes: 'الملاحظات:',
      noNotes: 'بدون ملاحظات',
      cancelBtn: 'إلغاء التكليف',
      employeeFallback: 'موظف #{id}',
      from: 'من',
      to: 'إلى',
      hours: 'الساعات:'
    },
    status: {
      approved: 'مقبول',
      completed: 'مكتمل',
      rejected: 'مرفوض',
      pending: 'قيد الانتظار'
    },
    form: {
      assignTitle: 'تكليف موظف بعمل إضافي',
      personalTitle: 'طلب عمل إضافي شخصي',
      selectEmployee: 'اختر الموظف',
      selectEmployeePlaceholder: '-- حدد الموظف --',
      date: 'التاريخ',
      startTime: 'وقت البداية',
      endTime: 'وقت النهاية',
      notes: 'الملاحظات / سبب التكليف',
      notesPlaceholder: 'مثال: إنجاز المشروع العاجل...',
      personalNotesPlaceholder: 'سبب ساعات الإضافي...',
      submitAssign: 'حفظ التكليف',
      submitPersonal: 'تقديم الطلب',
      cancel: 'إلغاء',
      requiredError: 'يرجى ملء جميع الحقول المطلوبة'
    },
    approveBtn: 'موافقة',
    rejectBtn: 'رفض',
    confirmModal: {
      approveTitle: 'تأكيد الموافقة',
      rejectTitle: 'تأكيد الرفض',
      approveDesc: 'هل أنت متأكد من موافقتك على طلب العمل الإضافي؟ لا يمكن التراجع عن هذا الإجراء.',
      rejectDesc: 'هل أنت متأكد من رفض طلب العمل الإضافي؟ لا يمكن التراجع عن هذا الإجراء.',
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
    title: 'التوظيف',
    subtitle: 'إدارة الشواغر الوظيفية',
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

  // ── Terminations ──
  terminations: {
    title: 'طلبات إنهاء الخدمة',
    subtitle: 'إدارة ومتابعة طلبات إنهاء الخدمة للموظفين',
    createRequest: 'طلب إنهاء خدمة',
    noRequests: 'لا توجد طلبات إنهاء خدمة',
    columns: {
      employee: 'الموظف',
      type: 'النوع',
      subtype: 'السبب الفرعي',
      date: 'تاريخ الإنهاء',
      status: 'الحالة',
      actions: 'الإجراءات'
    },
    types: {
      immediate: 'فوري',
      standard: 'عادي'
    },
    subtypes: {
      misconduct: 'سوء سلوك',
      company_composition: 'إعادة هيكلة الشركة',
      mutual_agreement: 'اتفاق متبادل'
    },
    status: {
      pending: 'قيد المراجعة',
      approved: 'مقبول',
      rejected: 'مرفوض'
    },
    form: {
      title: 'تقديم طلب إنهاء خدمة',
      employee: 'الموظف',
      selectEmployee: '-- اختر الموظف --',
      type: 'نوع الإنهاء',
      subtype: 'السبب الفرعي',
      date: 'تاريخ الإنهاء',
      reason: 'السبب القانوني',
      compensationAmount: 'مبلغ التعويض',
      documents: 'المستندات المرفقة',
      submit: 'إرسال الطلب',
      submitting: 'جاري الإرسال...',
      cancel: 'إلغاء'
    },
    modal: {
      approveTitle: 'الموافقة على إنهاء الخدمة',
      rejectTitle: 'رفض طلب إنهاء الخدمة',
      reasonLabel: 'سبب القرار (اختياري)',
      confirmApprove: 'تأكيد الموافقة',
      confirmReject: 'تأكيد الرفض',
      cancel: 'إلغاء'
    },
    toasts: {
      created: 'تم إنشاء طلب إنهاء الخدمة بنجاح',
      approved: 'تمت الموافقة على الطلب بنجاح',
      rejected: 'تم رفض الطلب بنجاح',
      deleted: 'تم الحذف بنجاح',
      error: 'حدث خطأ أثناء معالجة الطلب'
    }
  }
};

export default ar;