import re

def process_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Add useTranslation
    content = content.replace('import React from "react";\nimport { useNavigate } from "react-router-dom";', 'import React from "react";\nimport { useNavigate } from "react-router-dom";\nimport { useTranslation } from "react-i18next";')
    content = content.replace('import React, { useState } from "react";\nimport { useNavigate } from "react-router-dom";', 'import React, { useState } from "react";\nimport { useNavigate } from "react-router-dom";\nimport { useTranslation } from "react-i18next";')
    
    # Check if we successfully added useTranslation
    if 'useTranslation' not in content:
        # Fallback 1
        content = content.replace('import React from "react";', 'import React from "react";\nimport { useTranslation } from "react-i18next";')
        
    # Find the functional component definition
    component_match = re.search(r"export default function (\w+)\(\)\s*\{", content)
    if component_match:
        component_name = component_match.group(1)
        # Inside component
        content = content.replace(f'export default function {component_name}() {{\n  const navigate = useNavigate();', f'export default function {component_name}() {{\n  const {{ t, i18n }} = useTranslation();\n  const navigate = useNavigate();')
        
        # If the file didn't have navigate
        if f'export default function {component_name}() {{\n  const {{ t, i18n }} = useTranslation();' not in content:
            content = content.replace(f'export default function {component_name}() {{', f'export default function {component_name}() {{\n  const {{ t, i18n }} = useTranslation();')

    # Direction
    content = content.replace('<div className="p-6 bg-gray-50 min-h-screen" dir="ltr">', '<div className="p-6 bg-gray-50 min-h-screen" dir={i18n.language === \'ar\' ? \'rtl\' : \'ltr\'}>')

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# 1. Reports
process_file(
    r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\Reports.tsx",
    {
        'Reports & Analytics': '{t(\'reportsAnalytics\')}',
        'View and export company analytics and reports': '{t(\'viewExportAnalytics\')}',
        'Export All': '{t(\'exportAll\')}',
        'Attendance Trend vs Target': '{t(\'attendanceTrendTarget\')}',
        'Department Distribution': '{t(\'departmentDistribution\')}',
        'Payroll & Bonus Trends': '{t(\'payrollBonusTrends\')}',
        'Leave Usage by Department': '{t(\'leaveUsageByDept\')}',
        'Employee Satisfaction': '{t(\'employeeSatisfaction\')}',
        'Applicant Pipeline': '{t(\'applicantPipeline\')}',
        'Department Performance Comparison': '{t(\'deptPerformanceComparison\')}'
    }
)

# 2. EmployeeSearch
process_file(
    r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\EmployeeSearch.tsx",
    {
        'Employee Search': '{t(\'employeeSearch\')}',
        'Search and filter employees, view top-rated staff': '{t(\'searchFilterStaff\')}',
        'placeholder="Search by name, department, or position..."': 'placeholder={t(\'searchPlaceholder\')}',
        'Filter\n          </button>': '{t(\'filter\')}\n          </button>',
        'Total Employees': '{t(\'totalEmployees\')}',
        'Departments': '{t(\'departments\')}',
        'Avg Rating': '{t(\'avgRating\')}',
        'Top Rated Employees': '{t(\'topRatedEmployees\')}',
        'All Employees': '{t(\'allEmployees\')}'
    }
)

# 3. Announcements
process_file(
    r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\Announcements.tsx",
    {
        '<h1 className="text-2xl font-bold text-gray-900">Announcements</h1>': '<h1 className="text-2xl font-bold text-gray-900">{t(\'announcements\')}</h1>',
        'Create and manage company announcements': '{t(\'manageAnnouncements\')}',
        'New Announcement': '{t(\'newAnnouncement\')}',
        'Total</p>': '{t(\'total\')}</p>',
        '<p className="text-sm text-gray-500">Active</p>': '<p className="text-sm text-gray-500">{t(\'active\')}</p>',
        'High Priority': '{t(\'highPriority\')}',
        'Expired</p>': '{t(\'expired\')}</p>',
        'All Announcements': '{t(\'allAnnouncements\')}',
        '{announcement.priority}': '{t(announcement.priority.toLowerCase())}',
        '{announcement.status}': '{t(announcement.status.toLowerCase())}'
    }
)

# 4. OrganizationlStructure
process_file(
    r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\OrganizationlStructure.tsx",
    {
        'Organization Structure': '{t(\'organizationStructure\')}',
        'Manage departments and organizational hierarchy': '{t(\'manageHierarchy\')}',
        'Add Department': '{t(\'addDepartment\')}',
        'Total Departments': '{t(\'totalDepartments\')}',
        'Total Employees': '{t(\'totalEmployees\')}',
        'Department Managers': '{t(\'departmentManagers\')}',
        ' Employees</span>': ' {t(\'employees\')}</span>',
        'Manager: ': '{t(\'managerLabel\')} ',
        'Sub-departments:': '{t(\'subDepartmentsLabel\')}'
    }
)

# 5. SystemSettings
process_file(
    r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\SystemSettings.tsx",
    {
        'System Settings': '{t(\'systemSettings\')}',
        'Configure your system preferences and general settings': '{t(\'configureSettings\')}',
        'Working Hours': '{t(\'workingHours\')}',
        'Notice Period': '{t(\'noticePeriod\')}',
        'Official Holidays': '{t(\'officialHolidays\')}',
        'Currency Settings': '{t(\'currencySettings\')}',
        'Email Notifications': '{t(\'emailNotifications\')}',
        '<h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>': '<h3 className="text-lg font-semibold text-gray-800 mb-2">{t(\'security\')}</h3>',
        'Role Management': '{t(\'roleManagement\')}',
        'Backup Settings': '{t(\'backupSettings\')}',
        '<h3 className="text-lg font-semibold text-gray-800 mb-2">Language</h3>': '<h3 className="text-lg font-semibold text-gray-800 mb-2">{t(\'language\')}</h3>',
        'Click to edit →': '{t(\'clickToEdit\')}'
    }
)

print("Done")
