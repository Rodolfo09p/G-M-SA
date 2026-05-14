import { useState } from "react";
import {
  customersMockData,
  policiesMockData,
} from "@/app/(control-panel)/brokerage/data/brokerageMockData";
import { getExpiredCustomerDocuments } from "@/app/(control-panel)/policies/data/customerDocumentsMock";
import type { NewClaimPayload } from "../types/types";

export type ClaimChecklistKey =
  | "cedula_asegurado"
  | "informe_siniestro"
  | "fotografias"
  | "copia_poliza"
  | "parte_policial";

export type ClaimChecklistItem = {
  key: ClaimChecklistKey;
  label: string;
  required: boolean;
};

export type ClaimChecklistState = Partial<Record<ClaimChecklistKey, boolean>>;

const BASE_CLAIM_CHECKLIST: Omit<ClaimChecklistItem, "key">[] = [
  { label: "Informe del siniestro", required: true },
  { label: "Fotografías del incidente", required: true },
  { label: "Copia de póliza", required: false },
  { label: "Parte policial", required: false },
];

const BASE_KEYS: ClaimChecklistKey[] = [
  "informe_siniestro",
  "fotografias",
  "copia_poliza",
  "parte_policial",
];

export type PolicyPreview = {
  policyNumber: string;
  customerId: string;
  customerName: string;
  branch: string;
  assignedTo: string;
  assignmentType: "gym" | "agent";
  hasExpiredCedula: boolean;
  expiredCedulaLabel: string;
  expiredCedulaDate: string;
};

const TOTAL_STEPS = 3;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

type Args = {
  onClose: () => void;
  onSave: (payload: NewClaimPayload) => Promise<void>;
};

export const useNewClaimWizard = ({ onClose, onSave }: Args) => {
  const [activeStep, setActiveStep] = useState(0);
  const [policyQuery, setPolicyQuery] = useState("");
  const [policyPreview, setPolicyPreview] = useState<PolicyPreview | null>(null);
  const [policyNotFound, setPolicyNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<ClaimChecklistState>({});
  const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([]);
  const [occurrenceDate, setOccurrenceDate] = useState("");
  const [claimedAmount, setClaimedAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const checklistItems: ClaimChecklistItem[] = policyPreview
    ? [
        ...(policyPreview.hasExpiredCedula
          ? [{ key: "cedula_asegurado" as ClaimChecklistKey, label: "Cédula del asegurado (vencida)", required: true }]
          : []),
        ...BASE_KEYS.map((key, i) => ({ key, ...BASE_CLAIM_CHECKLIST[i] })),
      ]
    : [];

  const progressValue = Math.round((activeStep / (TOTAL_STEPS - 1)) * 100);

  const stepLabel = `Paso ${activeStep + 1} / ${TOTAL_STEPS}`;

  const stepDescriptions = [
    "Busca la póliza por número para cargar los datos del asegurado.",
    "Revisa y marca los documentos requeridos para este reclamo.",
    "Completa los datos del siniestro y confirma el registro.",
  ];

  const handleSearchPolicy = async () => {
    const query = policyQuery.trim().toUpperCase();

    if (!query) {
      return;
    }

    setIsSearching(true);
    setPolicyNotFound(false);
    setPolicyPreview(null);

    await wait(900);

    const policy = policiesMockData.find(
      (item) => item.policyNumber.toUpperCase() === query,
    );

    setIsSearching(false);

    if (!policy) {
      setPolicyNotFound(true);
      return;
    }

    const customer = customersMockData.find((item) => item.id === policy.customerId);
    const expiredDocs = getExpiredCustomerDocuments(policy.customerId);
    const expiredCedula = expiredDocs.find((doc) =>
      doc.label.toLowerCase().includes("c\u00e9dula") ||
      doc.label.toLowerCase().includes("cedula"),
    );

    setPolicyPreview({
      policyNumber: policy.policyNumber,
      customerId: policy.customerId,
      customerName: customer?.fullName ?? policy.customerId,
      branch: policy.branch,
      assignedTo: policy.assignedTo,
      assignmentType: policy.assignmentType,
      hasExpiredCedula: Boolean(expiredCedula),
      expiredCedulaLabel: expiredCedula?.label ?? "",
      expiredCedulaDate: expiredCedula?.expirationDate ?? "",
    });
  };

  const handleChecklistChange = (key: ClaimChecklistKey, delivered: boolean) => {
    setChecklistState((prev) => ({ ...prev, [key]: delivered }));
  };

  const handleGenerateMockDocuments = () => {
    if (!policyPreview) {
      return;
    }

    const deliveredItems = checklistItems
      .filter((item) => checklistState[item.key])
      .map((item) => `${policyPreview.policyNumber}_${item.key.toUpperCase()}.pdf`);

    setGeneratedDocuments(deliveredItems);
  };

  const validateStep = () => {
    setStepError(null);

    if (activeStep === 0) {
      if (!policyPreview) {
        setStepError("Debes buscar y seleccionar una póliza antes de continuar.");
        return false;
      }
    }

    if (activeStep === 2) {
      if (!occurrenceDate) {
        setStepError("La fecha de ocurrencia es obligatoria.");
        return false;
      }

      if (claimedAmount <= 0) {
        setStepError("El monto reclamado debe ser mayor a cero.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStepError(null);
    setActiveStep((prev) => prev - 1);
  };

  const handleClose = () => {
    if (isSaving || isSearching) {
      return;
    }

    setActiveStep(0);
    setPolicyQuery("");
    setPolicyPreview(null);
    setPolicyNotFound(false);
    setStepError(null);
    setChecklistState({});
    setGeneratedDocuments([]);
    setOccurrenceDate("");
    setClaimedAmount(0);
    setDescription("");
    onClose();
  };

  const handleSave = async () => {
    if (!validateStep() || !policyPreview || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        policyNumber: policyPreview.policyNumber,
        customerId: policyPreview.customerId,
        customerName: policyPreview.customerName,
        branch: policyPreview.branch,
        assignmentType: policyPreview.assignmentType,
        assignedTo: policyPreview.assignedTo,
        occurrenceDate,
        claimedAmount,
        description: description.trim(),
      });

      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeStep,
    policyQuery,
    policyPreview,
    policyNotFound,
    isSearching,
    isSaving,
    stepError,
    stepLabel,
    progressValue,
    checklistItems,
    checklistState,
    generatedDocuments,
    occurrenceDate,
    claimedAmount,
    description,
    currentStepDescription: stepDescriptions[activeStep] ?? "",
    isSummaryStep: activeStep === TOTAL_STEPS - 1,
    setPolicyQuery,
    setOccurrenceDate,
    setClaimedAmount,
    setDescription,
    handleSearchPolicy,
    handleChecklistChange,
    handleGenerateMockDocuments,
    handleNext,
    handleBack,
    handleClose,
    handleSave,
  };
};
