import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagerLayout from './shared/layouts/ManagerLayout';
import EmployeesList from './core/pages/manager/components/EmployeesList';
import EmployeeProfile from './core/pages/manager/components/EmployeeProfile';
import TasksBoard from './core/pages/Tasks/TasksBoard';
import AttendanceView       from './core/pages/Attendance/AttendanceView';
import LeaveRequests         from './core/pages/Leaves/LeaveRequests';
import OvertimeRequests      from './core/pages/Leaves/OvertimeRequests';

// ── Placeholder ───
function Page({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9ca3af' }}>{title}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/manager" replace />} />

        {/* ── Manager ── */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Page title="Dashboard" />} />
          <Route path="employees" element={<EmployeesList />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />
          <Route path="tasks" element={<TasksBoard />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="overtime" element={<OvertimeRequests />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="evaluation" element={<Page title="Evaluation" />} />
          <Route path="recruitment" element={<Page title="Recruitment" />} />
        </Route>
        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
