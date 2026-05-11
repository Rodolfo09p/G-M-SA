import { useMemo, useState } from "react";
import { customersMockData } from "../../brokerage/data/brokerageMockData";
import type { CustomerEntity } from "../../brokerage/types/brokerageTypes";
import {
  checklistConfig,
  type DocumentItem,
  type PersonaType,
  type Ramo,
} from "../data/dataConfig";
import { getExpiredCustomerDocuments, type CustomerDocument } from "../data/customerDocumentsMock";
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

const ADD_POLICY_STEPS: WizardStep[] = [
  {
    key: "person",
    title: "Buscar cliente",
    description: "Busca un cliente existente por su número de identificación.",
  },
  {
    key: "data",
    title: "Datos y ramo",
    description: "Completa compañía, asignación y datos del ramo.",
  },
  {
    key: "checklist",
    title: "Checklist de documentos",
    description: "Marca documentos entregados y genera el mock del documento.",
  },
  {
    key: "summary",
    title: "Resumen final",
    description: "Verifica todo antes de guardar la gestión.",
  },
];

type UseAddPolicyToExistingCustomerWizardArgs = {
  onClose: () => void;
  onSave: (payload: WizardPayload) => Promise<void>;
};

export type CustomerSearchResult = {
  status: "found" | "not_found" | "invalid";
  query: string;
};

const mapCustomerToWizardData = (
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

const toPersonaType = (customer: CustomerEntity): PersonaType =>
  customer.personType === "natural" ? "NATURAL" : "JURIDICA";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const useAddPolicyToExistingCustomerWizard = ({
  onClose,
  onSave,
}: UseAddPolicyToExistingCustomerWizardArgs) => {
  const [activeStep, setActiveStep] = useState(0);
  const [identificationQuery, setIdentificationQuery] = useState("");
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
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checklistItems = useMemo(() => {
    if (!personType || !branch) {
      return [];
    }

    return [...checklistConfig[branch][personType]].sort((a, b) => a.order - b.order);
  }, [personType, branch]);

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
    setIdentificationQuery("");
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
    setIsSearchingCustomer(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    if (isSaving || isSearchingCustomer) {
      return;
    }

    resetState();
    onClose();
  };

  const handleSearchCustomer = async (): Promise<CustomerSearchResult> => {
    if (isSaving || isSearchingCustomer) {
      return { status: "invalid", query: identificationQuery.trim() };
    }

    const query = identificationQuery.trim();

    if (!query) {
      setStepError("Ingresa un número de identificación para buscar.");
      return { status: "invalid", query };
    }

    setStepError("");
    setIsSearchingCustomer(true);

    try {
      await wait(1800);

      const foundCustomer =
        customersMockData.find(
          (customer) => customer.id.toLowerCase() === query.toLowerCase(),
        ) ?? null;

      if (!foundCustomer) {
        setSelectedCustomer(null);
        setExpiredDocuments([]);
        setPersonType(null);
        setClientData({});
        setStepError("");
        return { status: "not_found", query };
      }

      const mappedPersonType = toPersonaType(foundCustomer);

      setSelectedCustomer(foundCustomer);
      setPersonType(mappedPersonType);
      setClientData(mapCustomerToWizardData(foundCustomer, mappedPersonType));
      setExpiredDocuments(getExpiredCustomerDocuments(foundCustomer.id));
      setStepError("");
      return { status: "found", query };
    } finally {
      setIsSearchingCustomer(false);
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
    if (!selectedCustomer || !personType) {
      setStepError("Debes buscar y seleccionar un cliente existente.");
      return false;
    }

    return true;
  };

  const validateDataStep = () => {
    if (!branch) {
      setStepError("Debes seleccionar un ramo.");
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

    switch (ADD_POLICY_STEPS[activeStep].key) {
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
    if (isSaving || isSearchingCustomer) {
      return;
    }

    if (!validateStep()) {
      return;
    }

    setActiveStep((prev) => Math.min(prev + 1, ADD_POLICY_STEPS.length - 1));
  };

  const handleBack = () => {
    if (isSaving || isSearchingCustomer) {
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

    if (!selectedCustomer || !personType || !branch) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        personType,
        branch,
        company,
        assignment,
        clientData,
        branchData,
        checklist: checklistState,
        generatedDocuments,
      });

      handleClose();
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error && caughtError.message
          ? caughtError.message
          : "No se pudo agregar la póliza al cliente.";

      setStepError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const stepLabel = `Paso ${activeStep + 1} de ${ADD_POLICY_STEPS.length}`;
  const progressValue = ((activeStep + 1) / ADD_POLICY_STEPS.length) * 100;
  const isSummaryStep = ADD_POLICY_STEPS[activeStep].key === "summary";
  const currentStepDescription = ADD_POLICY_STEPS[activeStep].description;

  return {
    activeStep,
    stepError,
    stepLabel,
    progressValue,
    isSummaryStep,
    isSaving,
    isSearchingCustomer,
    identificationQuery,
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
    setIdentificationQuery,
    setCompany,
    setAssignment,
    setBranch,
    handleClose,
    handleBack,
    handleNext,
    handleSave,
    handleSearchCustomer,
    handleBranchFieldChange,
    handleChecklistChange,
    handleGenerateMockDocuments,
    ensureChecklistEntry,
  };
};
