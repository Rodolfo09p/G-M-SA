import { useMemo, useState } from "react";
import {
  customersMockData,
  policiesMockData,
  policyFinancesMockData,
} from "../../brokerage/data/brokerageMockData";
import type {
  CustomerEntity,
  PolicyEntity,
  PolicyFinanceEntity,
} from "../../brokerage/types/brokerageTypes";
import {
  checklistConfig,
  type DocumentItem,
  type PersonaType,
  type Ramo,
} from "../data/dataConfig";
import {
  getExpiredCustomerDocuments,
  type CustomerDocument,
} from "../data/customerDocumentsMock";
import {
  BRANCH_FIELDS_BY_BRANCH,
  CLIENT_FIELDS_BY_PERSON,
  VEHICLE_CATALOG,
} from "../constants/newPolicyWizardConfig";
import { toMockFileName } from "../helpers/newPolicyWizard";
import type { ChecklistEntry, WizardPayload, WizardStep } from "../types/newPolicyWizard";

const PAYMENT_PLAN_KEYS = new Set([
  "paymentDueDate",
  "totalPremium",
  "netPremium",
  "installments",
  "installmentValue",
]);
const CARD_PAYMENT_KEYS = new Set(["cardHolder", "cardNumber", "cardExpiry"]);

const RENEW_POLICY_STEPS: WizardStep[] = [
  {
    key: "person",
    title: "Buscar póliza",
    description: "Busca la póliza por su número para iniciar la renovación.",
  },
  {
    key: "data",
    title: "Renovación",
    description: "Completa los datos de renovación según el ramo.",
  },
  {
    key: "checklist",
    title: "Checklist de documentos",
    description: "Marca documentos entregados y genera el mock del documento.",
  },
  {
    key: "summary",
    title: "Resumen final",
    description: "Verifica todo antes de guardar la renovación.",
  },
];

type UseRenewPolicyWizardArgs = {
  onClose: () => void;
  onSave: (payload: { sourcePolicyNumber: string; payload: WizardPayload }) => Promise<void>;
};

type RenewSearchResult = {
  status: "found" | "not_found" | "invalid";
  query: string;
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

const policyBranchToRamo = (branch: string): Ramo =>
  branch.toUpperCase() === "SOA" ? "SOA" : "AUTOMOVIL";

const customerToPersonaType = (customer: CustomerEntity): PersonaType =>
  customer.personType === "natural" ? "NATURAL" : "JURIDICA";

const parseAutomobileDataFromDescription = (description: string) => {
  const source = description.trim();
  const detailsRegExp = /(\S+)\s+(\S+)\s+(\d{4}),\s*placa\s+(\S+)/i;
  const plateRegExp = /placa\s+([^\s,]+)/i;

  const detailsMatch = detailsRegExp.exec(source);

  if (detailsMatch) {
    return {
      vehicleBrand: detailsMatch[1],
      vehicleModel: detailsMatch[2],
      vehicleYear: detailsMatch[3],
      plate: detailsMatch[4],
    };
  }

  const plateMatch = plateRegExp.exec(source);

  return {
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    plate: plateMatch?.[1] ?? "",
  };
};

const mapCustomerToClientData = (
  customer: CustomerEntity,
  personType: PersonaType,
): Record<string, string> => {
  if (personType === "NATURAL") {
    return {
      fullName: customer.fullName,
      idNumber: customer.id,
      birthMonth: customer.birthMonth === "N/A" ? "" : customer.birthMonth,
      phone: customer.phoneMobile === "N/A" ? "" : customer.phoneMobile,
      phoneLandline:
        customer.phoneLandline === "N/A" ? "" : customer.phoneLandline,
      address: customer.address === "N/A" ? "" : customer.address,
    };
  }

  return {
    insuredName: customer.fullName,
    businessName: customer.fullName,
    ruc: customer.id,
    legalRepresentative: "",
    phone: customer.phoneMobile === "N/A" ? "" : customer.phoneMobile,
    phoneLandline:
      customer.phoneLandline === "N/A" ? "" : customer.phoneLandline,
    address: customer.address === "N/A" ? "" : customer.address,
  };
};

const mapFinanceToBranchData = (
  branch: Ramo,
  policy: PolicyEntity,
  finance: PolicyFinanceEntity | undefined,
): Record<string, string> => {
  const base = {
    policyNumber: policy.policyNumber,
    startDate: policy.startDate,
    endDate: policy.endDate,
  };

  if (branch === "SOA") {
    return {
      ...base,
      policyNumber: "",
      totalPremium: `${finance?.totalPremium ?? 0}`,
    };
  }

  const automobileData = parseAutomobileDataFromDescription(
    policy.insuredAssetDescription,
  );

  return {
    ...base,
    paymentType: finance?.paymentType ?? "CONTADO",
    paymentMethod: finance?.paymentMethod === "Debito" ? "DEBITO" : "BANCO",
    paymentDueDate: finance?.paymentDueDate && finance.paymentDueDate !== "N/A" ? finance.paymentDueDate : "",
    totalPremium: `${finance?.totalPremium ?? 0}`,
    netPremium: `${finance?.netPremium ?? 0}`,
    installments: `${finance?.installments ?? 1}`,
    installmentValue: `${finance?.installmentValue ?? 0}`,
    insuredAmount: `${finance?.insuredSum ?? 0}`,
    vehicleBrand: automobileData.vehicleBrand,
    vehicleModel: automobileData.vehicleModel,
    vehicleYear: automobileData.vehicleYear,
    plate: automobileData.plate,
  };
};

export const useRenewPolicyWizard = ({ onClose, onSave }: UseRenewPolicyWizardArgs) => {
  const [activeStep, setActiveStep] = useState(0);
  const [policyNumberQuery, setPolicyNumberQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyEntity | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerEntity | null>(null);
  const [expiredDocuments, setExpiredDocuments] = useState<CustomerDocument[]>([]);
  const [personType, setPersonType] = useState<PersonaType | null>(null);
  const [branch, setBranch] = useState<Ramo | null>(null);
  const [company, setCompany] = useState("");
  const [assignment, setAssignment] = useState("");
  const [clientData, setClientData] = useState<Record<string, string>>({});
  const [branchData, setBranchData] = useState<Record<string, string>>({});
  const [checklistState, setChecklistState] = useState<Record<string, ChecklistEntry>>({});
  const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([]);
  const [stepError, setStepError] = useState("");
  const [isSearchingPolicy, setIsSearchingPolicy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checklistItems = useMemo(() => {
    if (!personType || !branch) {
      return [];
    }

    return [...checklistConfig[branch][personType]].sort((a, b) => a.order - b.order);
  }, [branch, personType]);

  const currentClientFields = useMemo(() => {
    if (!personType) {
      return [];
    }

    return CLIENT_FIELDS_BY_PERSON[personType];
  }, [personType]);

  const baseBranchFields = useMemo(() => {
    if (!branch) {
      return [];
    }

    return BRANCH_FIELDS_BY_BRANCH[branch];
  }, [branch]);

  const currentBranchFields = useMemo(() => {
    const paymentType = branchData.paymentType;
    const paymentMethod = branchData.paymentMethod;

    return baseBranchFields.filter((field) => {
      if (branch === "SOA" && field.key === "totalPremium") {
        return true;
      }

      if (PAYMENT_PLAN_KEYS.has(field.key) && paymentType !== "PLAZO") {
        return false;
      }

      if (CARD_PAYMENT_KEYS.has(field.key) && paymentMethod !== "DEBITO") {
        return false;
      }

      return true;
    });
  }, [baseBranchFields, branch, branchData.paymentMethod, branchData.paymentType]);

  const modelOptions = useMemo(() => {
    if (branch !== "AUTOMOVIL") {
      return [];
    }

    const selectedBrand = branchData.vehicleBrand;

    if (!selectedBrand) {
      return [];
    }

    return VEHICLE_CATALOG[selectedBrand] ?? [];
  }, [branch, branchData.vehicleBrand]);

  const resetState = () => {
    setActiveStep(0);
    setPolicyNumberQuery("");
    setSelectedPolicy(null);
    setSelectedCustomer(null);
    setExpiredDocuments([]);
    setPersonType(null);
    setBranch(null);
    setCompany("");
    setAssignment("");
    setClientData({});
    setBranchData({});
    setChecklistState({});
    setGeneratedDocuments([]);
    setStepError("");
    setIsSearchingPolicy(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    if (isSaving || isSearchingPolicy) {
      return;
    }

    resetState();
    onClose();
  };

  const handleSearchPolicy = async (): Promise<RenewSearchResult> => {
    if (isSaving || isSearchingPolicy) {
      return { status: "invalid", query: policyNumberQuery.trim() };
    }

    const query = policyNumberQuery.trim();

    if (!query) {
      setStepError("Ingresa un número de póliza para buscar.");
      return { status: "invalid", query };
    }

    setStepError("");
    setIsSearchingPolicy(true);

    try {
      await wait(1800);

      const policy =
        policiesMockData.find(
          (item) => item.policyNumber.toLowerCase() === query.toLowerCase(),
        ) ?? null;

      if (!policy) {
        setSelectedPolicy(null);
        setSelectedCustomer(null);
        setExpiredDocuments([]);
        setPersonType(null);
        setBranch(null);
        setClientData({});
        setBranchData({});
        return { status: "not_found", query };
      }

      const customer =
        customersMockData.find((item) => item.id === policy.customerId) ?? null;

      if (!customer) {
        setSelectedPolicy(null);
        setSelectedCustomer(null);
        setExpiredDocuments([]);
        setPersonType(null);
        setBranch(null);
        setClientData({});
        setBranchData({});
        return { status: "not_found", query };
      }

      const policyFinance = policyFinancesMockData.find(
        (item) => item.policyNumber === policy.policyNumber,
      );

      const mappedPersonType = customerToPersonaType(customer);
      const mappedBranch = policyBranchToRamo(policy.branch);

      setSelectedPolicy(policy);
      setSelectedCustomer(customer);
      setExpiredDocuments(getExpiredCustomerDocuments(customer.id));
      setPersonType(mappedPersonType);
      setBranch(mappedBranch);
      setCompany(policy.insuranceCompany.toUpperCase());
      setAssignment(policy.assignedTo.toUpperCase());
      setClientData(mapCustomerToClientData(customer, mappedPersonType));
      setBranchData(mapFinanceToBranchData(mappedBranch, policy, policyFinance));
      setChecklistState({});
      setGeneratedDocuments([]);
      setStepError("");

      return { status: "found", query };
    } finally {
      setIsSearchingPolicy(false);
    }
  };

  const handleBranchFieldChange = (key: string, value: string) => {
    setBranchData((prev) => {
      const next = { ...prev, [key]: value };

      if (key === "vehicleBrand") {
        next.vehicleModel = "";
      }

      if (key === "paymentType" && value !== "PLAZO") {
        next.paymentDueDate = "";
        next.totalPremium = "";
        next.netPremium = "";
        next.installments = "";
        next.installmentValue = "";
      }

      if (key === "paymentMethod" && value !== "DEBITO") {
        next.cardHolder = "";
        next.cardNumber = "";
        next.cardExpiry = "";
      }

      return next;
    });
  };

  const ensureChecklistEntry = (item: DocumentItem): ChecklistEntry => {
    return (
      checklistState[item.key] ?? {
        delivered: false,
        hasExpiration: Boolean(item.hasExpirationDate),
        expirationDate: "",
      }
    );
  };

  const handleChecklistChange = (key: string, patch: Partial<ChecklistEntry>) => {
    setChecklistState((prev) => {
      const item = checklistItems.find((checkItem) => checkItem.key === key);
      const baseEntry: ChecklistEntry = prev[key] ?? {
        delivered: false,
        hasExpiration: Boolean(item?.hasExpirationDate),
        expirationDate: "",
      };

      return {
        ...prev,
        [key]: {
          ...baseEntry,
          ...patch,
        },
      };
    });
  };

  const validateSearchStep = () => {
    if (!selectedPolicy || !selectedCustomer || !personType || !branch) {
      setStepError("Debes buscar una póliza existente para continuar.");
      return false;
    }

    return true;
  };

  const validateDataStep = () => {
    if (!selectedPolicy || !branch) {
      setStepError("Debes buscar una póliza para continuar.");
      return false;
    }

    if (!company || !assignment) {
      setStepError("Selecciona compañía y asignación.");
      return false;
    }

    const missingBranch = currentBranchFields.filter(
      (field) => field.required && !branchData[field.key]?.trim(),
    );

    if (missingBranch.length > 0) {
      setStepError("Completa todos los datos requeridos del ramo.");
      return false;
    }

    if (branch === "AUTOMOVIL") {
      const currentPolicyNumber = selectedPolicy.policyNumber;
      const providedPolicyNumber = (branchData.policyNumber ?? "").trim();

      if (providedPolicyNumber !== currentPolicyNumber) {
        setStepError(
          "En daños propios se conserva el mismo número de póliza al renovar.",
        );
        return false;
      }
    }

    if (branch === "SOA") {
      const renewedPolicyNumber = (branchData.policyNumber ?? "").trim();

      if (!renewedPolicyNumber) {
        setStepError("En SOA debes ingresar el nuevo número de póliza.");
        return false;
      }

      if (renewedPolicyNumber === selectedPolicy.policyNumber) {
        setStepError(
          "En SOA la renovación debe tener un número de póliza diferente.",
        );
        return false;
      }
    }

    if (branch === "AUTOMOVIL" && !modelOptions.includes(branchData.vehicleModel ?? "")) {
      setStepError("Selecciona un modelo válido según la marca.");
      return false;
    }

    return true;
  };

  const validateChecklistStep = () => {
    const deliveredCount = checklistItems.filter(
      (item) => checklistState[item.key]?.delivered,
    ).length;

    if (deliveredCount === 0) {
      setStepError("Marca al menos un documento entregado para continuar.");
      return false;
    }

    const invalidExpiration = checklistItems.some((item) => {
      const state = checklistState[item.key];

      if (!state?.delivered || !state.hasExpiration) {
        return false;
      }

      return !state.expirationDate;
    });

    if (invalidExpiration) {
      setStepError("Si marcas vencimiento, debes ingresar una fecha.");
      return false;
    }

    return true;
  };

  const validateStep = () => {
    setStepError("");

    switch (RENEW_POLICY_STEPS[activeStep].key) {
      case "person":
        return validateSearchStep();
      case "data":
        return validateDataStep();
      case "checklist":
        return validateChecklistStep();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isSaving || isSearchingPolicy) {
      return;
    }

    if (!validateStep()) {
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, RENEW_POLICY_STEPS.length - 1));
  };

  const handleBack = () => {
    if (isSaving || isSearchingPolicy) {
      return;
    }

    setStepError("");
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleGenerateMockDocuments = () => {
    const documents = checklistItems
      .filter((item) => checklistState[item.key]?.delivered)
      .map((item) => toMockFileName(item.key));

    setGeneratedDocuments(documents);
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    if (!validateStep()) {
      return;
    }

    if (!selectedPolicy || !personType || !branch) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        sourcePolicyNumber: selectedPolicy.policyNumber,
        payload: {
          personType,
          branch,
          company,
          assignment,
          clientData,
          branchData,
          checklist: checklistState,
          generatedDocuments,
        },
      });

      handleClose();
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error && caughtError.message
          ? caughtError.message
          : "No se pudo renovar la póliza.";

      setStepError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const stepLabel = `Paso ${activeStep + 1} de ${RENEW_POLICY_STEPS.length}`;
  const progressValue = ((activeStep + 1) / RENEW_POLICY_STEPS.length) * 100;
  const isSummaryStep = RENEW_POLICY_STEPS[activeStep].key === "summary";
  const currentStepDescription = RENEW_POLICY_STEPS[activeStep].description;

  return {
    activeStep,
    stepError,
    stepLabel,
    progressValue,
    isSummaryStep,
    isSaving,
    isSearchingPolicy,
    policyNumberQuery,
    selectedPolicy,
    selectedCustomer,
    expiredDocuments,
    personType,
    branch,
    company,
    assignment,
    clientData,
    branchData,
    checklistItems,
    checklistState,
    generatedDocuments,
    currentClientFields,
    currentBranchFields,
    modelOptions,
    currentStepDescription,
    setPolicyNumberQuery,
    setCompany,
    setAssignment,
    handleClose,
    handleBack,
    handleNext,
    handleSave,
    handleSearchPolicy,
    handleBranchFieldChange,
    handleChecklistChange,
    handleGenerateMockDocuments,
    ensureChecklistEntry,
  };
};
