import {
  policiesMockData,
  policyFinancesMockData,
} from "../../brokerage/data/brokerageMockData";
import type {
  AssignmentType,
  PolicyEntity,
  PolicyFinanceEntity,
} from "../../brokerage/types/brokerageTypes";
import type { WizardPayload } from "../types/newPolicyWizard";

type RenewPolicyArgs = {
  sourcePolicyNumber: string;
  payload: WizardPayload;
};

const toNumber = (value: string | undefined, fallback = 0) => {
  const normalized = Number(value ?? "");
  return Number.isFinite(normalized) ? normalized : fallback;
};

const toMaskedCard = (rawCardNumber: string | undefined) => {
  const digits =
    (rawCardNumber ?? "")
      .replaceAll(" ", "")
      .replaceAll("-", "")
      .replaceAll("_", "")
      .replaceAll(".", "");

  if (digits.length < 4) {
    return "N/A";
  }

  return `**** **** **** ${digits.slice(-4)}`;
};

const toAssignmentType = (assignment: string): AssignmentType => {
  return assignment === "AGENTE" ? "agent" : "gym";
};

const buildPolicyFromRenewal = (
  existingPolicy: PolicyEntity,
  payload: WizardPayload,
): PolicyEntity => {
  const { branch, company, assignment, branchData } = payload;
  const isSOA = branch === "SOA";

  let insuredAssetDescription = branchData.insuredVehicle ?? "Riesgo no especificado";

  if (branch === "AUTOMOVIL") {
    insuredAssetDescription = `Vehiculo ${branchData.vehicleBrand ?? ""} ${branchData.vehicleModel ?? ""} ${branchData.vehicleYear ?? ""}, placa ${branchData.plate ?? ""}.`.trim();
  }

  if (isSOA) {
    insuredAssetDescription = `${branchData.assetType ?? "Vehiculo"} ${branchData.vehicleBrand ?? ""}, placa ${branchData.vehiclePlate ?? "N/A"}, chasis ${branchData.vehicleChassis ?? "N/A"}, color ${branchData.vehicleColor ?? "N/A"}.`.trim();
  }

  return {
    ...existingPolicy,
    policyNumber: branchData.policyNumber ?? existingPolicy.policyNumber,
    branch: branch === "AUTOMOVIL" ? "Automovil" : "SOA",
    insuranceCompany: company,
    assignedTo: assignment,
    assignmentType: toAssignmentType(assignment),
    startDate: branchData.startDate ?? existingPolicy.startDate,
    endDate: branchData.endDate ?? existingPolicy.endDate,
    insuredAssetDescription,
    status: "renewed",
  };
};

const buildFinanceFromRenewal = (
  payload: WizardPayload,
  policyNumber: string,
): PolicyFinanceEntity => {
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

export const renewLocalPolicyFromWizard = ({
  sourcePolicyNumber,
  payload,
}: RenewPolicyArgs) => {
  const existingPolicyIndex = policiesMockData.findIndex(
    (item) => item.policyNumber === sourcePolicyNumber,
  );

  if (existingPolicyIndex < 0) {
    return {
      ok: false,
      error: `No se encontró la póliza ${sourcePolicyNumber}.`,
    };
  }

  const existingPolicy = policiesMockData[existingPolicyIndex];
  const isSourceSOA = existingPolicy.branch.toUpperCase() === "SOA";

  if (isSourceSOA) {
    const renewedPolicyNumber = payload.branchData.policyNumber?.trim();

    if (!renewedPolicyNumber) {
      return {
        ok: false,
        error: "Para renovar SOA debes ingresar un nuevo número de póliza.",
      };
    }

    if (renewedPolicyNumber === sourcePolicyNumber) {
      return {
        ok: false,
        error: "En SOA la renovación debe tener un número de póliza diferente.",
      };
    }

    const duplicatedNumber = policiesMockData.some(
      (item) => item.policyNumber === renewedPolicyNumber,
    );

    if (duplicatedNumber) {
      return {
        ok: false,
        error: "Ya existe una póliza con ese número.",
      };
    }

    const renewedPolicy = buildPolicyFromRenewal(existingPolicy, {
      ...payload,
      branchData: {
        ...payload.branchData,
        policyNumber: renewedPolicyNumber,
      },
    });

    const renewedFinance = buildFinanceFromRenewal(payload, renewedPolicyNumber);

    policiesMockData.unshift(renewedPolicy);
    policyFinancesMockData.unshift(renewedFinance);

    return { ok: true };
  }

  const enforcedPayload: WizardPayload = {
    ...payload,
    branchData: {
      ...payload.branchData,
      policyNumber: sourcePolicyNumber,
    },
  };

  const renewedPolicy = buildPolicyFromRenewal(existingPolicy, enforcedPayload);
  policiesMockData[existingPolicyIndex] = renewedPolicy;

  const existingFinanceIndex = policyFinancesMockData.findIndex(
    (item) => item.policyNumber === sourcePolicyNumber,
  );
  const renewedFinance = buildFinanceFromRenewal(enforcedPayload, sourcePolicyNumber);

  if (existingFinanceIndex >= 0) {
    policyFinancesMockData[existingFinanceIndex] = renewedFinance;
  } else {
    policyFinancesMockData.unshift(renewedFinance);
  }

  return { ok: true };
};
