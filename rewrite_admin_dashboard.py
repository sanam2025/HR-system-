import re

with open(r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\Dashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add useTranslation
content = content.replace('import React from "react";\nimport { useNavigate } from "react-router-dom";', 'import React from "react";\nimport { useNavigate } from "react-router-dom";\nimport { useTranslation } from "react-i18next";')

# Inside Dashboard
content = content.replace('export default function Dashboard() {\n  const navigate = useNavigate();', 'export default function Dashboard() {\n  const { t, i18n } = useTranslation();\n  const navigate = useNavigate();')

# Direction
content = content.replace('<div className="p-6 bg-gray-50 min-h-screen" dir="ltr">', '<div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === \'ar\' ? \'rtl\' : \'ltr\'}>')

# Translations
content = content.replace('{t(\'welcome\')}', '{t(\'welcome\')}') # Just in case it already ran partially
content = content.replace('Welcome', '{t(\'welcome\')}')
content = content.replace('Overview of employee performance and statistics.', '{t(\'dashboardSubtitle\')}')
content = content.replace('Total Employees', '{t(\'totalEmployees\')}')
content = content.replace('New Hires (This Month)', '{t(\'newHiresMonth\')}')
content = content.replace('Monthly Payroll', '{t(\'monthlyPayroll\')}')
content = content.replace('Attendance Rate', '{t(\'attendanceRate\')}')
content = content.replace('Pending Complaints', '{t(\'pendingComplaints\')}')
content = content.replace('Departments', '{t(\'departments\')}')
content = content.replace('Avg Employee Rating', '{t(\'avgEmployeeRating\')}')
content = content.replace('On-Time Arrival', '{t(\'onTimeArrival\')}')
content = content.replace('Monthly New Hires', '{t(\'monthlyNewHires\')}')
content = content.replace('Weekly Attendance Trend', '{t(\'weeklyAttendanceTrend\')}')
content = content.replace('Employee Status Distribution', '{t(\'employeeStatusDistribution\')}')
content = content.replace('Leave Requests', '{t(\'leaveRequests\')}')
content = content.replace('{statsData.pendingLeaves} Pending', '{statsData.pendingLeaves} {t(\'pending\')}')
content = content.replace('Pending\n                  </div>', '{t(\'pending\')}\n                  </div>')
content = content.replace('Recent Announcements', '{t(\'recentAnnouncements\')}')

# Employee Status Chart
content = content.replace('label={({ name, value }) => `${name} (${value}%)`}', 'label={({ name, value }) => `${t(name === \'On Leave\' ? \'onLeave\' : name.toLowerCase())} (${value}%)`}')
content = content.replace('<span className="text-sm text-gray-600">{status.name}</span>', '<span className="text-sm text-gray-600">{t(status.name === \'On Leave\' ? \'onLeave\' : status.name.toLowerCase())}</span>')

# Priority
content = content.replace('{announcement.priority}', '{t(announcement.priority.toLowerCase())}')

with open(r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\Dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
