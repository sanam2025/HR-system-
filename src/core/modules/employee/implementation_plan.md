# خطة نقل واجهات Employee

## الملفات المطلوب نسخها من المشروع المرجعي:

### 1. مكتبات داعمة (lib/)
- src/lib/date.ts
- src/lib/text.ts
- src/lib/http/ApiError.ts
- src/lib/http/client.ts
- src/lib/http/queryClient.ts
- src/lib/http/types.ts

### 2. api models
- src/api/models.ts

### 3. api/hooks/
- useAttendance.ts
- useAnnouncements.ts
- useComplaints.ts
- useHourlyLeaveRequests.ts
- useLeaveRequests.ts
- useNotifications.ts
- useOnboarding.ts
- useOvertime.ts
- usePayroll.ts
- usePeople.ts
- useProfiles.ts
- useResignations.ts
- useTasks.ts

### 4. store/authStore.ts

### 5. Employee components
- commend-components/index.tsx
- speciel-components/AttendanceComponents.tsx
- speciel-components/DashboardComponents.tsx
- speciel-components/FinanceComponents.tsx
- speciel-components/PersonPicker.tsx
- speciel-components/ProfileComponents.tsx
- speciel-components/TaskComponents.tsx

### 6. Employee pages
- EmployeeDashboard.tsx
- EmployeeProfile.tsx
- EmployeeAttendance.tsx
- EmployeeComplaints.tsx
- EmployeeFinance.tsx
- EmployeeTasks.tsx

### 7. Employee types
- types/index.ts
