import type { AssignmentType } from "../../brokerage/types/brokerageTypes";

export type ClaimStatus =
  | "reported"
  | "in_review"
  | "documents_pending"
  | "approved"
  | "rejected"
  | "closed";

export type ClaimChecklist = {
  incidentReport: boolean;
  insuredIdCopy: boolean;
  policyCopy: boolean;
  photos: boolean;
};

export type ClaimNotification = {
  id: string;
  category: "Documentos" | "Inspección" | "Pago" | "Legal";
  message: string;
  createdAt: string;
  read: boolean;
};

export type ClaimEntity = {
  claimNumber: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  branch: string;
  assignmentType: AssignmentType;
  assignedTo: string;
  status: ClaimStatus;
  occurrenceDate: string;
  reportDate: string;
  claimedAmount: number;
  currency: "USD";
  description: string;
  checklist: ClaimChecklist;
  notifications: ClaimNotification[];
};

export type NewClaimPayload = {
  policyNumber: string;
  customerId: string;
  customerName: string;
  branch: string;
  assignmentType: AssignmentType;
  assignedTo: string;
  occurrenceDate: string;
  claimedAmount: number;
  description: string;
};

export type ClaimTableRow = {
  id: string;
  claimNumber: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  branch: string;
  assignmentType: AssignmentType;
  assignedTo: string;
  statusCode: ClaimStatus;
  status: string;
  occurrenceDate: string;
  reportDate: string;
  claimedAmount: number;
  currency: "USD";
  description: string;
  checklist: ClaimChecklist;
  pendingNotifications: number;
  notifications: ClaimNotification[];
};