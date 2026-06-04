//import EmployeeRoute from "./core/shared/routes/Employee";


//function App() {
 // return (
   //<BrowserRouter>
    //  <Routes>
      //  <Route path="/" element={<Navigate to="/manager" replace />} />

      //  {/* ── Manager ── */}
      //  <Route path="/manager" element={<ManagerLayout />}>
       //   <Route index element={<Page title="Dashboard" />} />
       //   <Route path="employees" element={<EmployeesList />} />
        //  <Route path="employees/:id" element={<EmployeeProfile />} />
        //  <Route path="tasks" element={<TasksBoard />} />
         // <Route path="leaves" element={<Page title="Leaves" />} />
         // <Route path="overtime" element={<Page title="Overtime" />} />
         // <Route path="attendance" element={<Page title="Attendance" />} />
         // <Route path="evaluation" element={<Page title="Evaluation" />} />
        //  <Route path="recruitment" element={<Page title="Recruitment" />} />
       // </Route>
       // <Route path="*" element={<Navigate to="/manager" replace />} />
    //  </Routes>
    //</BrowserRouter>


  //<EmployeeRoute/>
  //);
//}

//export default App;




// App.tsx
// App.tsx
// src/App.tsx
import EmployeeRoute from "./shared/routs/Employee";

function App() {
  return (
    <div className="App">
      <EmployeeRoute />
    </div>
  );
}

export default App;