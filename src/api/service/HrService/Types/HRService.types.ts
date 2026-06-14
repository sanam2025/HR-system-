import type { UserStatus } from "../../../../Types/types.types";

export type RecruitmentStatus = "approved" | "pending" | "rejected";
export type PostingStatus = 'open' | 'closed';


export type JobRequisition = {
  id: number;
  job_title: string;
  experience: number;
  status: RecruitmentStatus | null;
  created_at: string;
  department: {
    id: number;
    name: string;
  };
  requested_by: {
    id: number;
    full_name: string;
  };
  skills_count: number;
  is_posted: boolean;
}

type Requisition = {
  id: number
  job_title: string
  description: string
  experience: string
  status: RecruitmentStatus | null
}

type Posting = {
  id: number;
  job_title: string,
  description: string,
  status: PostingStatus,
  posted_at: Date,
  updated_at: Date
}

export type JobRequisitionApprove = {
  requisition: Requisition;
  posting: Posting;
}

export type JobRequisitionReject = {
  id: number;
  job_title: string;
  description: string;
  experience: string;
  status: RecruitmentStatus | null;
  requested_by:{
    id: number;
    full_name: string;
    status: UserStatus;
  }
  department:{
    id:number;
    name: string;
  }
  skills: [
    {
      id:number;
      name: string;
    }
  ]
  
}

// {
//     "message": "Job requisition rejected successfully.",
//     "data": {
//         "id": 15,
//         "job_title": "سؤبسبب",
//         "description": "صللاىةةتههنو",
//         "experience": 17,
//         "status": "rejected",
//         "requested_by": {
//             "id": 4,
//             "full_name": "ahmadBack",
//             "status": "inactive"
//         },
//         "department": {
//             "id": 4,
//             "name": "backend"
//         },
//         "skills": [
//             {
//                 "id": 1,
//                 "name": "PHP"
//             },
//             {
//                 "id": 2,
//                 "name": "Laravel"
//             },
//             {
//                 "id": 10,
//                 "name": "Time Management"
//             }
//         ]
//     }
// }


// {
//     "message": "Job requisition approved and posting created successfully.",
//     "data": {
//         "requisition": {
//             "id": 14,
//             "job_title": "ىةةىى",
//             "description": "ضهفلاةح094",
//             "experience": 11,
//             "status": "approved"
//         },
//         "posting": {
//             "id": 2,
//             "job_title": "lara",
//             "description": "We need a senior Laravel developer for MasarHR team.",
//             "status": "open",
//             "posted_at": "2026-06-14 16:32:34",
//             "updated_at": "2026-06-14 16:32:34"
//         }
//     }
// }