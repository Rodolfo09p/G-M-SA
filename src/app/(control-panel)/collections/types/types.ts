export type CollectionSyncState = "new" | "persistent" | "updated" | "recovered";

export type CollectionOperationalStage =
  | "pending_first_call"
  | "in_follow_up"
  | "promise_to_pay"
  | "escalated"
  | "recovered";

export type CollectionPriority = "critical" | "high" | "medium";

export type CollectionContactChannel = "call" | "whatsapp" | "email";

export type CollectionFollowUpOutcome =
  | "contacted"
  | "promise_to_pay"
  | "no_answer"
  | "escalated";

export type CollectionImportRow = {
  customerId: string;
  customerName: string;
  policyNumber: string;
  installmentCode: string;
  branch: string;
  insuranceCompany: string;
  assignedTo: string;
  dueDate: string;
  overdueDays: number;
  amountDue: number;
  currency: string;
  phone: string;
  email: string;
  lastPaymentDate: string;
};

export type CollectionTimelineItem = {
  id: string;
  date: string;
  type: "imported" | "updated" | "follow_up" | "promise" | "recovered";
  title: string;
  description: string;
  tone: "info" | "warning" | "success" | "error";
};

export type CollectionFollowUp = {
  id: string;
  date: string;
  channel: CollectionContactChannel;
  outcome: CollectionFollowUpOutcome;
  agent: string;
  note: string;
  nextActionDate: string;
};

export type CollectionCaseEntity = {
  id: string;
  caseKey: string;
  customerId: string;
  customerName: string;
  policyNumber: string;
  installmentCode: string;
  branch: string;
  insuranceCompany: string;
  assignedTo: string;
  dueDate: string;
  overdueDays: number;
  amountDue: number;
  currency: string;
  phone: string;
  email: string;
  lastPaymentDate: string;
  priority: CollectionPriority;
  operationalStage: CollectionOperationalStage;
  firstSeenSnapshotId: string;
  firstSeenAt: string;
  lastChangedSnapshotId: string;
  lastChangedAt: string;
  recoveredAt?: string;
  recoveredSnapshotId?: string;
  notes: string[];
  followUps: CollectionFollowUp[];
  timeline: CollectionTimelineItem[];
};

export type CollectionImportSnapshot = {
  id: string;
  label: string;
  sourceFileName: string;
  importedAt: string;
  rows: CollectionImportRow[];
};

export type CollectionImportSummary = {
  totalRows: number;
  newCases: number;
  updatedCases: number;
  recoveredCases: number;
  unchangedCases: number;
};

export type CollectionImportHistoryItem = {
  snapshotId: string;
  label: string;
  sourceFileName: string;
  importedAt: string;
  summary: CollectionImportSummary;
};

export type CollectionExcelField = {
  field: keyof CollectionImportRow;
  label: string;
  required: boolean;
  example: string;
};

export type CollectionArchitectureTable = {
  name: string;
  purpose: string;
  pk: string;
  sk: string;
};

export type CollectionArchitectureIndex = {
  name: string;
  usage: string;
  pk: string;
  sk: string;
};

export type CollectionCaseView = CollectionCaseEntity & {
  syncState: CollectionSyncState;
};
