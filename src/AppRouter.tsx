// src/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { SuspenseWrapper } from './routes/SuspenseWrapper';
import { hrRoutes } from './routes/hrRoutes';
import { managerRoutes } from './routes/managerRoutes';
import { employeeRoutes } from './routes/employeeRoutes';
import { adminRoutes } from './routes/adminRoutes';

const PublicJobsPage = React.lazy(() => import('@/core/pages/PublicJobs/PublicJobsPage'));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Hr" replace />
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
