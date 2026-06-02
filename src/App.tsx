// TasksBoard removed because routes are handled by HRRoute. Keep import removed to avoid unused variable error.
import HRRoute from "./shared/routes/HRRoute";

// Placeholder components were removed as routes are handled by HRRoute

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="/manager" replace />} />

    //     {/* ── Manager ── */}
    //     <Route path="/manager" element={<ManagerLayout />}>
    //       <Route index element={<Page title="Dashboard" />} />
    //       <Route path="employees" element={<EmployeesList />} />
    //       <Route path="employees/:id" element={<EmployeeProfile />} />
    //       <Route path="tasks" element={<TasksBoard />} />
    //       <Route path="leaves" element={<Page title="Leaves" />} />
    //       <Route path="overtime" element={<Page title="Overtime" />} />
    //       <Route path="attendance" element={<Page title="Attendance" />} />
    //       <Route path="evaluation" element={<Page title="Evaluation" />} />
    //       <Route path="recruitment" element={<Page title="Recruitment" />} />
    //     </Route>
    //     <Route path="*" element={<Navigate to="/manager" replace />} />
    //   </Routes>
    // </BrowserRouter>

    <HRRoute />
  );
}

export default App;
