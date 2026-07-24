import re

def process_reports(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Data array replacements (use translation keys directly in the arrays)
    replacements = [
        # Cards
        ('title: "Attendance Report"', 'title: t(\'attendanceReport\')'),
        ('title: "Employee Turnover"', 'title: t(\'employeeTurnover\')'),
        ('title: "Payroll Summary"', 'title: t(\'payrollSummary\')'),
        ('title: "Leave Usage"', 'title: t(\'leaveUsage\')'),
        ('value: "SAR 485K"', 'value: t(\'sar485k\')'),
        ('value: "156 days"', 'value: t(\'days156\')'),
        
        # Dept names in data
        ('name: "IT"', 'name: t(\'itDept\')'),
        ('name: "Sales"', 'name: t(\'salesDept\')'),
        ('name: "Finance"', 'name: t(\'financeDept\')'),
        ('name: "HR"', 'name: t(\'hrDept\')'),
        ('name: "Operations"', 'name: t(\'operationsDept\')'),
        
        ('department: "IT"', 'department: t(\'itDept\')'),
        ('department: "Sales"', 'department: t(\'salesDept\')'),
        ('department: "Finance"', 'department: t(\'financeDept\')'),
        ('department: "HR"', 'department: t(\'hrDept\')'),
        ('department: "Operations"', 'department: t(\'operationsDept\')'),
        
        # Applicant pipeline
        ('stage: "Applications"', 'stage: t(\'applications\')'),
        ('stage: "Interviews"', 'stage: t(\'interviews\')'),
        ('stage: "Job Offers"', 'stage: t(\'jobOffers\')'),
        ('stage: "Hired"', 'stage: t(\'hired\')'),
        
        # Weeks
        ('week: "Week 1"', 'week: t(\'week1\')'),
        ('week: "Week 2"', 'week: t(\'week2\')'),
        ('week: "Week 3"', 'week: t(\'week3\')'),
        ('week: "Week 4"', 'week: t(\'week4\')'),
        ('week: "Week 5"', 'week: t(\'week5\')'),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    # Recharts dataKey names for legends/tooltips
    # For Bar, Line, Area etc. We add `name={t('something')}`
    
    chart_replacements = [
        # Attendance chart
        ('dataKey="rate" stroke="#10b981"', 'dataKey="rate" name={t(\'rate\')} stroke="#10b981"'),
        ('dataKey="target" stroke="#9ca3af"', 'dataKey="target" name={t(\'target\')} stroke="#9ca3af"'),
        
        # Payroll chart
        ('dataKey="amount" fill="#8b5cf6"', 'dataKey="amount" name={t(\'amount\')} fill="#8b5cf6"'),
        ('dataKey="bonus" fill="#f59e0b"', 'dataKey="bonus" name={t(\'bonus\')} fill="#f59e0b"'),
        
        # Leave usage
        ('dataKey="annual" stackId="a" fill="#3b82f6"', 'dataKey="annual" stackId="a" fill="#3b82f6" name={t(\'annual\')}'),
        ('dataKey="sick" stackId="a" fill="#f59e0b"', 'dataKey="sick" stackId="a" fill="#f59e0b" name={t(\'sick\')}'),
        ('dataKey="personal" stackId="a" fill="#10b981"', 'dataKey="personal" stackId="a" fill="#10b981" name={t(\'personal\')}'),
        
        # Performance
        ('dataKey="performance" fill="#3b82f6"', 'dataKey="performance" fill="#3b82f6" name={t(\'performance\')}'),
        ('dataKey="satisfaction" fill="#8b5cf6"', 'dataKey="satisfaction" fill="#8b5cf6" name={t(\'satisfaction\')}'),
        
        # Employee Satisfaction (AreaChart)
        ('dataKey="satisfaction" stroke="#8b5cf6" fill="url(#colorSatisfaction)"', 'dataKey="satisfaction" stroke="#8b5cf6" fill="url(#colorSatisfaction)" name={t(\'satisfaction\')}'),
    ]
    
    for old, new in chart_replacements:
        content = content.replace(old, new)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

process_reports(r"c:\Ahmad\sana\HR-system-\src\core\modules\admin\pages\Reports.tsx")
print("Reports.tsx processed successfully.")
