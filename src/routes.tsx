import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ManagerLayout from './shared/layouts/ManagerLayout';
import Dashboard from './core/pages/manager/Dashboard';
import EmployeesList from './core/pages/manager/components/EmployeesList';
import EmployeeProfile from './core/pages/manager/components/EmployeeProfile';
import TasksBoard from './core/pages/Tasks/TasksBoard';
import AttendanceView from './core/pages/Attendance/AttendanceView';
import LeaveRequests from './core/pages/Leaves/LeaveRequests';
import OvertimeRequests from './core/pages/Leaves/OvertimeRequests';
import PeriodicEvaluation from './core/pages/Evaluation/PeriodicEvaluation';
import { LanguageProvider } from './i18n/translations/LanguageContext';
import Recruitment from './core/pages/Recruitment/Recruitment';



function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/manager" replace />} />

                    {/* ── Manager ── */}
                    <Route path="/manager" element={<ManagerLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="employees" element={<EmployeesList />} />
                        <Route path="employees/:id" element={<EmployeeProfile />} />
                        <Route path="tasks" element={<TasksBoard />} />
                        <Route path="leaves" element={<LeaveRequests />} />
                        <Route path="overtime" element={<OvertimeRequests />} />
                        <Route path="attendance" element={<AttendanceView />} />
                        <Route path="evaluation" element={<PeriodicEvaluation />} />
                        <Route path="recruitment" element={<Recruitment />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/manager" replace />} />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;
