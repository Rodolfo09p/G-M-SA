import { customersMockData, policiesMockData, policyFinancesMockData } from "../../brokerage/data/brokerageMockData";
import type { AssignmentType, CustomerEntity, PolicyEntity, PolicyFinanceEntity, PersonType } from "../../brokerage/types/brokerageTypes";
import type { WizardPayload } from "../types/newPolicyWizard";

const toNumber = (value: string | undefined, fallback = 0) => {
  const normalized = Number(value ?? "");
  return Number.isFinite(normalized) ? normalized : fallback;
};

const toMaskedCard = (rawCardNumber: string | undefined) => {
  const digits = (rawCardNumber ?? "").replaceAll(/\D/g, "");

  if (digits.length < 4) {
    return "N/A";
  }

  return `**** **** **** ${digits.slice(-4)}`;
};

const toAssignmentType = (assignment: string): AssignmentType => {
  return assignment === "AGENTE" ? "agent" : "gym";
};

const toPersonType = (personType: WizardPayload["personType"]): PersonType => {
  return personType === "JURIDICA" ? "legal" : "natural";
};

const buildCustomer = (payload: WizardPayload): CustomerEntity => {
  const { personType, clientData } = payload;
  const isLegal = personType === "JURIDICA";

  const customerId = isLegal ? (clientData.ruc ?? "") : (clientData.idNumber ?? "");
  const fullName = isLegal ? (clientData.businessName ?? "") : (clientData.fullName ?? "");

  return {
    id: customerId,
    fullName,
    personType: toPersonType(personType),
    phoneMobile: clientData.phone ?? "N/A",
    phoneLandline: "N/A",
    address: clientData.address ?? "N/A",
    birthMonth: isLegal ? "N/A" : (clientData.birthMonth ?? "N/A"),
    nationality: "Nicaraguense",
    resident: true,
  };
};

const buildPolicy = (payload: WizardPayload, customerId: string): PolicyEntity => {
  const { branch, company, assignment, branchData } = payload;

  const policyNumber = branchData.policyNumber ?? `POL-${Date.now()}`;
  const isAutomovil = branch === "AUTOMOVIL";

  const insuredAssetDescription = isAutomovil
    ? `Vehiculo ${branchData.vehicleBrand ?? ""} ${branchData.vehicleModel ?? ""} ${branchData.vehicleYear ?? ""}, placa ${branchData.plate ?? ""}.`.trim()
    : (branchData.insuredVehicle ?? "Riesgo no especificado");

  return {
    policyNumber,
    customerId,
    branch: isAutomovil ? "Automovil" : "SOA",
    insuranceCompany: company,
    status: "active",
    assignedTo: assignment,
    assignmentType: toAssignmentType(assignment),
    startDate: branchData.startDate ?? "",
    endDate: branchData.endDate ?? "",
    insuredAssetDescription,
  };
};

const buildFinance = (payload: WizardPayload, policyNumber: string): PolicyFinanceEntity => {
  const { branch, branchData } = payload;
  const isSOA = branch === "SOA";
  const isPaymentPlan = branchData.paymentType === "PLAZO";

  const totalPremium = toNumber(branchData.totalPremium, 0);
  const installments = isSOA ? 1 : Math.max(1, toNumber(branchData.installments, 1));
  const fallbackInstallmentValue = totalPremium > 0 ? totalPremium / installments : 0;
  const paymentType = isSOA || !isPaymentPlan ? "CONTADO" : "PLAZO";
  let paymentMethod = "N/A";

  if (!isSOA) {
    paymentMethod = branchData.paymentMethod === "DEBITO" ? "Debito" : "Banco";
  }

  let paymentDueDate = "N/A";

  if (!isSOA && isPaymentPlan) {
    paymentDueDate = branchData.paymentDueDate ?? "N/A";
  }

  return {
    policyNumber,
    insuredSum: branch === "AUTOMOVIL" ? toNumber(branchData.insuredAmount, 0) : 0,
    netPremium: toNumber(branchData.netPremium, totalPremium),
    totalPremium,
    paymentType,
    paymentMethod,
    paymentDueDate,
    debitCardMasked:
      !isSOA && branchData.paymentMethod === "DEBITO"
        ? toMaskedCard(branchData.cardNumber)
        : "N/A",
    currency: "USD",
    installments,
    installmentValue: toNumber(branchData.installmentValue, fallbackInstallmentValue),
  };
};

export const addLocalPolicyFromWizard = (payload: WizardPayload) => {
  const customer = buildCustomer(payload);
  const existingCustomer = customersMockData.some((item) => item.id === customer.id);

  if (!existingCustomer) {
    customersMockData.push(customer);
  }

  const policy = buildPolicy(payload, customer.id);
  const policyAlreadyExists = policiesMockData.some((item) => item.policyNumber === policy.policyNumber);

  if (policyAlreadyExists) {
    return {
      ok: false,
      error: "Ya existe una poliza con ese numero.",
    };
  }

  policiesMockData.unshift(policy);
  policyFinancesMockData.unshift(buildFinance(payload, policy.policyNumber));

  return { ok: true };
};
