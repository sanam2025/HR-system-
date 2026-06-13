import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HRLayout from "../layouts/HRLayout";
import Dashboard from "../../core/modules/HR/pages/Dashboard";
import Employees from "../../core/modules/HR/pages/Employees";
import Attendance from "../../core/modules/HR/pages/Attendance";
import Leaves from "../../core/modules/HR/pages/Leaves";
import Recruitment from "../../core/modules/HR/pages/Recruitment";
import Payroll from "../../core/modules/HR/pages/Payroll";
import ApplicantDetail from "../../core/modules/HR/pages/ApplicantDetail";
import AllApplicants from "../../core/modules/HR/pages/AllApplicants";
import AcceptedCandidates from "../../core/modules/HR/pages/AcceptedCandidates";
import Terminations from "../../core/modules/HR/pages/Terminations";
import Resignations from "../../core/modules/HR/pages/Resignations";
import Contracts from "../../core/modules/HR/pages/Contracts";
import JobRequisitionForm from "../../core/modules/HR/pages/JobRequisitionForm";
import JobRequisitionDetail from "../../core/modules/HR/pages/JobRequisitionDetail";
import JobPostings from "../../core/modules/HR/pages/JobPostings";
import JobPostingDetail from "../../core/modules/HR/pages/JobPostingDetail";
import JobPostingForm from "../../core/modules/HR/pages/JobPostingForm";

const route = createBrowserRouter([
  {
    path: "/Hr",
    element: <HRLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "employees", element: <Employees /> },
      { path: "attendance", element: <Attendance /> },
      { path: "leaves", element: <Leaves /> },
      { path: "recruitment", element: <Recruitment /> },
      { path: "payroll", element: <Payroll /> },
      { path: "all-applicants", element: <AllApplicants /> },
      { path: "recruitment/applicant/:id", element: <ApplicantDetail /> },
      { path: "accepted-candidates", element: <AcceptedCandidates /> },
      { path: "terminations", element: <Terminations /> },
      { path: "resignations", element: <Resignations /> },
      { path: "contracts", element: <Contracts /> },
      { path: "recruitment/:id", element: <JobRequisitionDetail /> },
      { path: "recruitment/create", element: <JobRequisitionForm /> },
      { path: "recruitment/edit/:id", element: <JobRequisitionForm /> },
      { path: "job-postings", element: <JobPostings /> },
      { path: "job-postings/:id", element: <JobPostingDetail /> },
      { path: "job-postings/edit/:id", element: <JobPostingForm /> },
      // ✅ مسار المتقدمين (يستقبل jobId)
      { path: "recruitment/applicants/:jobId", element: <AllApplicants /> },
    ],
  },
]);

function HRRoute() {
  return <RouterProvider router={route} />;
}

export default HRRoute;
