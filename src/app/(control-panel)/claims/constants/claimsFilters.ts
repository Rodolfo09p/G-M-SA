import { AssignmentType } from "../../brokerage/types/brokerageTypes";
import { ClaimStatus } from "../types/types";

const assignmentFilterOptions: Array<{
  value: "all" | AssignmentType;
  label: string;
}> = [
  { value: "all", label: "Todas" },
  { value: "gym", label: "G&M" },
  { value: "agent", label: "Subagente" },
];

const statusFilterOptions: Array<{
  value: "all" | ClaimStatus;
  label: string;
}> = [
  { value: "all", label: "Todos" },
  { value: "reported", label: "Reportado" },
  { value: "in_review", label: "En revisión" },
  { value: "documents_pending", label: "Documentos pendientes" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
  { value: "closed", label: "Cerrado" },
];

export { assignmentFilterOptions, statusFilterOptions };