// // core/modules/HR/pages/JobPostingDetail.tsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Edit, Trash2 } from "lucide-react";
// import { useJobPostings } from "../hooks/useJobPostings";
// import type { JobPosting } from "../types/jobPosting.types";

// // تعريف نوع الخطأ
// interface ApiError {
//   message: string;
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
// }

// const getErrorMessage = (err: ApiError): string => {
//   if (err.response?.data?.message) {
//     return err.response.data.message;
//   }
//   if (err.message) {
//     return err.message;
//   }
//   return "An unknown error occurred";
// };

// export default function JobPostingDetail() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { getById, delete: deletePosting } = useJobPostings(false);
//   const [posting, setPosting] = useState<JobPosting | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!id) return;
//       try {
//         setLoading(true);
//         const data = await getById(Number(id));
//         setPosting(data);
//         setError(null);
//       } catch (err) {
//         const errorMessage = getErrorMessage(err as ApiError);
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, getById]);

//   const handleDelete = async () => {
//     if (
//       posting &&
//       window.confirm("Are you sure you want to delete this job posting?")
//     ) {
//       try {
//         await deletePosting(posting.id);
//         navigate("/Hr/job-postings");
//       } catch (err) {
//         const errorMessage = getErrorMessage(err as ApiError);
//         alert("Failed to delete: " + errorMessage);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <p className="text-red-600 mb-4">Error: {error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!posting) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen">
//         <div className="text-center py-12">
//           <p className="text-gray-500">Job posting not found</p>
//           <button
//             onClick={() => navigate("/Hr/job-postings")}
//             className="mt-4 text-blue-500"
//           >
//             Back to Job Postings
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen" dir="ltr">
//       <div className="mb-6">
//         <button
//           onClick={() => navigate("/Hr/job-postings")}
//           className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Job Postings
//         </button>
//         <div className="flex justify-between items-start flex-wrap gap-4">
//           <h1 className="text-2xl font-bold text-gray-900">
//             {posting.job_title}
//           </h1>
//           <div className="flex gap-2">
//             <button
//               onClick={() => navigate(`/Hr/job-postings/edit/${posting.id}`)}
//               className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               <Trash2 className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="p-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">
//             Job Details
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Job Title</p>
//               <p className="font-medium text-gray-900">{posting.job_title}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Experience Required</p>
//               <p className="font-medium text-gray-900">
//                 {posting.experience}+ years
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Status</p>
//               <span
//                 className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
//                   posting.status === "open"
//                     ? "bg-emerald-100 text-emerald-700"
//                     : "bg-gray-100 text-gray-700"
//                 }`}
//               >
//                 {posting.status}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 mb-1">Created At</p>
//               <p className="font-medium text-gray-900">
//                 {new Date(posting.created_at).toLocaleDateString()}
//               </p>
//             </div>
//             {posting.description && (
//               <div className="md:col-span-2">
//                 <p className="text-sm text-gray-500 mb-1">Description</p>
//                 <p className="text-gray-700">{posting.description}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
