// src/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { SuspenseWrapper } from './routes/SuspenseWrapper';
import { hrRoutes } from './routes/hrRoutes';
import { managerRoutes } from './routes/managerRoutes';
import { employeeRoutes } from './routes/employeeRoutes';
import { adminRoutes } from './routes/adminRoutes';

const PublicJobsPage = React.lazy(() => import('@/core/pages/PublicJobs/PublicJobsPage'));
const Login = React.lazy(() => import('@/core/modules/auth/Login'));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Hr" replace />
  },
  {
    path: "/login",
    element: <SuspenseWrapper><Login /></SuspenseWrapper>
  },
  hrRoutes,
  {
    path: '/careers',
    element: <SuspenseWrapper><PublicJobsPage /></SuspenseWrapper>,
  },
  managerRoutes,
  employeeRoutes,
  adminRoutes,
]);

export default function AppRouter() {
  return <RouterProvider router={appRouter} />;
}
