import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/translations/LanguageContext';
import ManagerLayout from './shared/layouts/ManagerLayout';
import Dashboard from './core/pages/manager/Dashboard';
import EmployeesList from './core/pages/manager/components/EmployeesList';
import EmployeeProfile from './core/pages/manager/components/EmployeeProfile';
import TasksBoard from './core/pages/Tasks/TasksBoard';
import AttendanceView from './core/pages/Attendance/AttendanceView';
import LeaveRequests from './core/pages/Leaves/LeaveRequests';
import OvertimeRequests from './core/pages/Leaves/OvertimeRequests';
import PeriodicEvaluation from './core/pages/Evaluation/PeriodicEvaluation';
import Recruitment from './core/pages/Recruitment/Recruitment';
import InterviewsPage from './core/pages/Recruitment/InterviewsPage';
import PublicJobsPage from './core/pages/PublicJobs/PublicJobsPage';
import TerminationRequests from './core/pages/Termination/TerminationRequests';

const router = createBrowserRouter([
    {
        path: '/careers',
        element: <PublicJobsPage />,
    },
    {
        path: '/manager',
        element: <ManagerLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'employees', element: <EmployeesList /> },
            { path: 'employees/:id', element: <EmployeeProfile /> },
            { path: 'tasks', element: <TasksBoard /> },
            { path: 'leaves', element: <LeaveRequests /> },
            { path: 'overtime', element: <OvertimeRequests /> },
            { path: 'attendance', element: <AttendanceView /> },
            { path: 'evaluation', element: <PeriodicEvaluation /> },
            { path: 'recruitment', element: <Recruitment /> },
            { path: 'interviews', element: <InterviewsPage /> },
            { path: 'terminations', element: <TerminationRequests /> },
        ],
    },
]);

export default function AppRoutes() {
    return (
        <LanguageProvider>
            <RouterProvider router={router} />
        </LanguageProvider>
    );
}
