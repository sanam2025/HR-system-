
export type OfferStatus = "pending" | "sent" | "accepted" | "declined";
export type EmploymentStatus = "pending" | "converted";

export interface AcceptedCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  interviewDate: string;
  interviewResult: string;
  offerStatus: OfferStatus;
  employmentStatus: EmploymentStatus;
  offerSentDate?: string;
  offerAcceptedDate?: string;
  salary?: number;
  startDate?: string;
}

export interface JobOfferData {
  candidateId: string;
  candidateName: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  benefits: string;
  additionalNotes: string;
}