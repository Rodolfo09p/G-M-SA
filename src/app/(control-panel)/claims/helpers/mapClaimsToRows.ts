import { claimsMockData } from "../data/claimsMockData";
import { ClaimStatus, ClaimTableRow } from "../types/types";

const STATUS_LABELS: Record<ClaimStatus, string> = {
  reported: "Reportado",
  in_review: "En revisión",
  documents_pending: "Documentos pendientes",
  approved: "Aprobado",
  rejected: "Rechazado",
  closed: "Cerrado",
};

const mapClaimsToRows = (): ClaimTableRow[] => {
  return claimsMockData.map((claim) => ({
    id: claim.claimNumber,
    claimNumber: claim.claimNumber,
    policyNumber: claim.policyNumber,
    customerId: claim.customerId,
    customerName: claim.customerName,
    branch: claim.branch,
    assignmentType: claim.assignmentType,
    assignedTo: claim.assignedTo,
    statusCode: claim.status,
    status: STATUS_LABELS[claim.status],
    occurrenceDate: claim.occurrenceDate,
    reportDate: claim.reportDate,
    claimedAmount: claim.claimedAmount,
    currency: claim.currency,
    description: claim.description,
    checklist: claim.checklist,
    pendingNotifications: claim.notifications.filter((item) => !item.read).length,
    notifications: claim.notifications,
  }));
};

export { mapClaimsToRows };