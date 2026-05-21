import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagerLayout from './shared/layouts/ManagerLayout';
import EmployeesList from './core/pages/manager/EmployeesList';
import EmployeeProfile from './core/pages/manager/EmployeeProfile';
import TasksBoard from './core/pages/Tasks/TasksBoard';

// ── Placeholder ───
function Page({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
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
          <Route path="leaves" element={<Page title="Leaves" />} />
          <Route path="overtime" element={<Page title="Overtime" />} />
          <Route path="attendance" element={<Page title="Attendance" />} />
          <Route path="evaluation" element={<Page title="Evaluation" />} />
          <Route path="recruitment" element={<Page title="Recruitment" />} />
        </Route>
        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
