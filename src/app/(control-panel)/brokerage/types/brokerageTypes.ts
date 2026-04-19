export type PersonType = "natural" | "legal";

export type AssignmentType = "gym" | "agent";

export type CustomerEntity = {
  id: string;
  fullName: string;
  personType: PersonType;
  phoneMobile: string;
  phoneLandline: string;
  address: string;
  birthMonth: string;
  nationality: string;
  resident: boolean;
};

export type PolicyEntity = {
  policyNumber: string;
  customerId: string;
  branch: string;
  insuranceCompany: string;
  status: "active" | "cancelled";
  assignedTo: string;
  assignmentType: AssignmentType;
  startDate: string;
  endDate: string;
  insuredAssetDescription: string;
};

export type PolicyFinanceEntity = {
  policyNumber: string;
  insuredSum: number;
  netPremium: number;
  totalPremium: number;
  paymentMethod: string;
  currency: "USD" | "NIO";
  installments: number;
  installmentValue: number;
};
