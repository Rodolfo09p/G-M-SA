import { AssignmentType } from "../../brokerage/types/brokerageTypes";

export type PolicyTableRow = {
  id: string;
  policyNumber: string;
  customerName: string;
  branch: string;
  insuranceCompany: string;
  status: string;
  assignedTo: string;
  assignmentType: AssignmentType;
  startDate: string;
  endDate: string;
  insuredAssetDescription: string;
  customerId: string;
  paymentType: string;
  paymentMethod: string;
  paymentDueDate: string;
  debitCardMasked: string;
  installments: number;
  installmentValue: number;
  netPremium: number;
  insuredSum: number;
  totalPremium: number;
  currency: string;
};