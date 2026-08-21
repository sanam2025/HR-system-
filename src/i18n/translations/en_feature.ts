const en = {
  // ── Navigation ─
  nav: {
    dashboard: 'Dashboard',
    employees: 'Employees',
    tasks: 'Tasks',
    leaves: 'Leave Requests',
    overtime: 'Overtime',
    attendance: 'Attendance',
    evaluation: 'Periodic Review',
    recruitment: 'Recruitment',
    interviews: 'Interviews',
    announcements: 'Announcements',
    mainMenu: 'Main Menu',
  },

  // ── Common ──
  common: {
    viewAll: 'View All',
    days: 'Days',
    approve: 'Approve',
    reject: 'Reject',
  },

  // ── Dashboard ──
  dashboard: {
    totalEmployees: 'Total Employees',
    presentToday: 'Present Today',
    avgPerformance: 'Avg Performance',
    outOf: 'out of 5',
    attendanceRate: 'Attendance Rate',
    thisMonth: 'This Month',
    pendingTasks: 'Pending Tasks',
    completedThisMonth: 'Completed This Month',
    performanceChart: 'Performance Over Time',
    avgRating: 'Average Rating',
    attendanceChart: 'Attendance Rate',
    attendancePct: 'Attendance %',
    pendingTasksList: 'Recent Pending Tasks',
    pendingLeavesList: 'Pending Leave Requests',
    noPendingLeaves: 'No pending leave requests',
    pendingLeaves: 'Pending Leaves',
    pendingOvertime: 'Pending Overtime',
    completedTasks: 'Completed Tasks',
    presentEmployees: 'Present Employees'
  },

  // ── Announcements ──
  announcements: {
    title: 'Announcements Management',
    subtitle: 'Create and track announcements for your department',
    createNew: 'Create Announcement',
    activeTitle: 'Announcements',
    form: {
      createTitle: 'Create New Announcement',
      editTitle: 'Edit Announcement',
      titleLabel: 'Announcement Title',
      bodyLabel: 'Announcement Body',
      priorityLabel: 'Priority',
      startsAtLabel: 'Publish Date',
      endsAtLabel: 'End Date (Optional)',
      audienceNote: '📢 This announcement will be directed automatically to all employees in your department.',
      saveBtn: 'Save Announcement',
      savingBtn: 'Saving...',
      cancelBtn: 'Cancel',
      fillRequired: 'Please fill all required fields',
      createdSuccess: 'Announcement created successfully ✅',
      updatedSuccess: 'Announcement updated successfully ✅',
    },
    list: {
      title: 'Announcements List',
      loading: 'Loading...',
      emptyMsg: 'No announcements yet',
      createFirst: '+ Create First Announcement',
      columns: {
        title: 'Title',
        audience: 'Audience',
        priority: 'Priority',
        status: 'Status',
        date: 'Publish Date',
        actions: 'Actions',
      },
      publishNow: 'Publish Now',
      edit: 'Edit',
      delete: 'Delete',
      publishedSuccess: 'Published immediately ✅',
      hrNote: 'You cannot edit or delete HR announcements',
    },
    deleteConfirm: {
      title: 'Confirm Delete',
      desc: 'Are you sure you want to delete the announcement "{title}"? This action cannot be undone.',
      yesBtn: 'Yes, delete',
      cancelBtn: 'Cancel',
      success: 'Deleted successfully',
    },
    priorities: {
      urgent: '🔴 Urgent',
      normal: '🟡 Normal',
      info: '🟢 Info',
      high:   '🔴 Urgent',
      medium: '🟡 Normal',
      low:    '🟢 Info',
    },
    audiences: {
      all: 'All',
      department: 'Department',
      managers: 'Managers',
    },
    statuses: {
      draft: 'Draft',
      scheduled: 'Scheduled',
      active: 'Active',
      expired: 'Expired',
    }
  },

  // ── Sidebar / Topbar ─
  layout: {
    systemName: 'Masar HR',
    university: 'University of Damascus',
    managerRole: 'Department Manager',
    userName: 'Ahmad Front',
    userAvatar: 'A',
  },

  // ── Tasks ──
  tasks: {
    boardTitle: 'Tasks Board',
    activeTasks: 'total tasks',
    newTask: 'New Task',
    columns: {
      new: 'New',
      inProgress: 'In Progress',
      completed: 'Completed',
      late: 'Late',
    },
    noTasks: 'No tasks found',
    rateTask: 'Rate Task',
    createModal: {
      title: 'Create New Task',
      taskTitle: 'Task Title',
      taskTitlePlaceholder: 'Enter task title...',
      assignee: 'Assignee',
      selectEmployee: 'Select Employee...',
      priority: 'Priority',
      dueDate: 'Due Date',
      description: 'Description',
      descriptionPlaceholder: 'Detailed description of the task...',
      cancel: 'Cancel',
      createBtn: 'Create & Assign Task',
      requiredError: 'Please fill in all required fields',
      success: 'Task created successfully',
    },
    rateModal: {
      title: 'Rate Task',
      rating: 'Rating',
      notes: 'Notes',
      notesPlaceholder: 'Add feedback about performance...',
      saveBtn: 'Save Rating',
      cancel: 'Cancel',
      error: 'Please select a rating for the task',
      success: 'Task rated successfully',
      ratings: {
        poor: 'Poor',
        fair: 'Fair',
        good: 'Good',
        veryGood: 'Very Good',
        excellent: 'Excellent'
      }
    },
    priorities: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    }
  },

  // ── Employees ──
  employees: {
    listTitle: 'Employee List',
    employeesCount: 'employees',
    searchPlaceholder: 'Search for an employee...',
    filterAll: 'All',
    status: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      leave: 'Leave'
    },
    noEmployees: 'No employees found',
    tryChanging: 'Try changing the search query or filter',
    tasks: 'Tasks',
    leaves: 'Leaves'
  },

  // ── Employee Profile ──
  employeeProfile: {
    notFound: 'Employee not found',
    back: 'Back',
    backToList: 'Back to List',
    today: 'Today',
    joinDate: 'Join Date:',
    leaveBalance: 'Leave Balance',
    days: 'Days',
    totalTasks: 'Total Tasks',
    avgRating: 'Avg Rating',
    activeTasks: 'Active Tasks',
    noTasks: 'No tasks assigned',
    dueDate: 'Due Date:',
    attendanceRecord: 'Attendance Record',
    checkIn: 'Check-In:',
    checkOut: '— Check-Out:',
    delay: 'Delay',
    mins: 'mins'
  },

  // ── Leaves ──
  leaves: {
    title: 'Leaves',
    pendingReview: 'pending requests awaiting your review',
    pendingAttention: 'pending requests need attention',
    mainTabs: {
      teamLeaves: 'Team Leaves',
      myLeaves: 'My Leaves'
    },
    myLeaves: {
      newRequest: 'New Leave Request',
      form: {
        title: 'Submit Leave Request',
        type: 'Leave Type',
        startDate: 'Start Date',
        date: 'Date',
        daysCount: 'Number of Days',
        startTime: 'Start Time',
        endTime: 'End Time',
        reason: 'Reason',
        submit: 'Submit Request',
        submitting: 'Submitting...',
        cancel: 'Cancel'
      },
      status: {
        pending: 'Pending Review',
        approved: 'Approved',
        rejected: 'Rejected'
      },
      toast: {
        success: 'Leave request submitted successfully'
      }
    },
    tabs: {
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    },
    types: {
      annual: 'Annual',
      sick: 'Sick',
      emergency: 'Emergency',
      unpaid: 'Unpaid'
    },
    dailyToggle: 'Daily Leave',
    hourlyToggle: 'Hourly Leave',
    noRequests: 'No requests found',
    requestedOn: 'Requested on:',
    days: 'days',
    reason: 'Reason:',
    remainingBalance: 'Remaining balance:',
    insufficientBalance: '(Insufficient balance)',
    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    confirmModal: {
      approveTitle: 'Confirm Approval',
      rejectTitle: 'Confirm Rejection',
      approveDesc: 'Are you sure you want to approve this leave request? This action cannot be undone.',
      rejectDesc: 'Are you sure you want to reject this leave request? This action cannot be undone.',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    toast: {
      approved: 'Request approved successfully',
      rejected: 'Request rejected successfully'
    },
    toasts: {
      approved: 'Request approved successfully',
      rejected: 'Request rejected successfully'
    }
  },

  // ── Overtime ──
  overtime: {
    title: 'Overtime Requests',
    subtitle: 'pending requests',
    pendingRequests: 'pending requests',
    pendingAlert: 'requests awaiting your action',
    awaitingAction: 'requests awaiting your action',
    tabs: {
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    },
    noRequests: 'No overtime requests',
    requestedOn: 'Requested on',
    hours: 'hours',
    hoursLabel: 'hours',
    date: 'Date',
    dateLabel: 'Date',
    reason: 'Reason',
    reasonLabel: 'Reason',
    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    confirmModal: {
      approveTitle: 'Confirm Approval',
      rejectTitle: 'Confirm Rejection',
      approveDesc: 'Are you sure you want to approve this overtime request? This action cannot be undone.',
      rejectDesc: 'Are you sure you want to reject this overtime request? This action cannot be undone.',
      confirm: 'Confirm',
      cancel: 'Cancel'
    },
    toast: {
      approved: 'Request approved successfully',
      rejected: 'Request rejected successfully'
    },
    toasts: {
      approved: 'Request approved successfully',
      rejected: 'Request rejected successfully'
    }
  },

  // ── Attendance ──
  attendance: {
    title: 'Attendance Overview',
    subtitle: 'Track employee attendance records',
    stats: {
      total: 'Total Days',
      present: 'Present Days',
      absent: 'Absent Days',
      late: 'Late Days'
    },
    searchPlaceholder: 'Search employees...',
    recordsTitle: 'Attendance Records:',
    tabs: {
      byEmployee: 'By Employee',
      generalReport: 'General Report'
    },
    filter: {
      fromDate: 'From Date',
      toDate: 'To Date',
      status: 'Status',
      all: 'All',
      present: 'Present',
      absent: 'Absent',
      late: 'Late'
    },
    employeeCol: 'Employee',
    columns: {
      date: 'Date',
      status: 'Status',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      delay: 'Delay (min)',
      earlyLeave: 'Early Leave (min)'
    },
    noRecords: 'No attendance records found',
    min: 'min'
  },

  // ── Evaluation ──
  evaluation: {
    title: 'Periodic Evaluation',
    subtitle: 'Comprehensive evaluation of performance, attendance, and behavior',
    errorIncomplete: 'Please fill in all fields and rate all criteria',
    successMsg: 'Evaluation submitted successfully!',
    criteria: {
      performance: 'Performance Quality & Productivity',
      attendance: 'Discipline & Attendance',
      behavior: 'Professional Behavior & Interaction',
      teamwork: 'Teamwork & Collaboration',
      initiative: 'Initiative & Creativity'
    },
    successCard: {
      title: 'Evaluation Submitted!',
      thankYou: 'Thank you for evaluating',
      avgRating: 'Overall Average Rating',
      evaluateAnother: 'Evaluate Another Employee'
    },
    form: {
      selectEmployee: 'Select Employee *',
      selectPlaceholder: '-- Select an Employee --',
      evalMonth: 'Evaluation Month *',
      scaleHint: '1 = Poor  –  5 = Excellent',
      avgRating: 'Overall Average Rating',
      notes: 'Additional Notes',
      notesPlaceholder: 'Add your detailed notes about the employee\'s performance...',
      submit: 'Submit Evaluation to HR'
    }
  },

  // ── Recruitment ──
  recruitment: {
    title: 'Recruitment & Candidates',
    subtitle: 'Manage job vacancies and evaluate candidates',
    tabVacancy: 'Job Vacancy Request',
    tabCandidates: 'Candidate Evaluation',
    vacancy: {
      title: 'Request New Job Vacancy',
      positionTitle: 'Position Title',
      positionPlaceholder: 'e.g., Senior React Developer',
      description: 'Job Description',
      descriptionPlaceholder: 'Describe the role, responsibilities and expectations...',
      experience: 'Required Years of Experience',
      count: 'Number of Positions',
      reason: 'Reason for Request',
      reasonPlaceholder: 'Why is this position needed?',
      requirements: 'Key Requirements',
      requirementsPlaceholder: 'Required skills, experience...',
      requirementsHint: 'Select required skills for the position',
      selectSkill: '-- Select a skill --',
      customSkillPlaceholder: 'Or type a skill not in the list...',
      addCustomSkillBtn: 'Add Skill',
      deadline: 'Target Hiring Date',
      submitBtn: 'Submit Request to HR',
      successTitle: 'Request Sent!',
      successNote: 'Your request for',
      successNote2: 'has been submitted to the HR department.',
      sendAnother: 'Send Another Request',
      toasts: {
        fillAll: 'Please fill in the title and reason',
        success: 'Vacancy request sent successfully'
      }
    },
    candidates: {
      title: 'Top Candidates Ranking',
      sendRanking: 'Submit Final Ranking',
      moveHint: 'Use the arrows to rank candidates based on your preference.',
      experience: 'years exp.',
      interviewScore: 'Interview Rating',
      cvScore: 'CV Rating',
      communicationScore: 'Communication Skills',
      totalScore: 'Overall Score',
      rateAllFirst: 'Please rate all candidates on all 3 criteria before submitting',
      notRatedYet: 'Not rated yet',
      liveRanking: 'Live Ranking',
      tieHint: 'When scores tie, use the arrows to manually set the order',
      successTitle: 'Ranking Submitted!',
      successNote: 'Thank you. The HR department will process the offers based on your ranking.',
      toasts: {
        success: 'Candidate ranking submitted successfully'
      }
    }
  },
  interviews: {
    title: 'Interviews Management',
    subtitle: 'Candidates awaiting evaluation · Rate and submit final ranking',
    searchPlaceholder: 'Search for a candidate...',
    candidatesCount: 'candidate(s)',
    ratedCount: 'rated',
    rateAllWarning: 'Rate all candidates with stars to be able to send the final ranking',
    sendRanking: 'Submit Final Ranking',
    sendingRanking: 'Submitting...',
    rankingSent: 'Submitted ✅',
    rankingPanel: 'Live Ranking',
    rankingSubtitle: 'Updates automatically · Use arrows to break ties manually',
    readyToSend: '🎉 All candidates rated! You can submit the final ranking now.',
    rankingDone: '✅ Final ranking submitted successfully',
    interviewRating: 'Interview Rating',
    notRatedYet: 'Not rated yet',
    notes: 'Notes',
    yearsExp: 'yrs exp.',
    cvScore: 'CV Score',
    noResults: 'No results matching your search',
    statusPending: 'Awaiting Interview',
    statusDone: 'Evaluated',
    statusRejected: 'Rejected',
    toasts: {
      success: 'Ratings and ranking submitted successfully ✅',
      error: 'An error occurred, please check your connection',
      rateFirst: 'Please rate all candidates first'
    }
  },
};

export default en;