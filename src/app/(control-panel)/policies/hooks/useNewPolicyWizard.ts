import { useMemo, useState } from 'react';
import { checklistConfig, type DocumentItem, type PersonaType, type Ramo } from '../data/dataConfig';
import {
	BRANCH_FIELDS_BY_BRANCH,
	CLIENT_FIELDS_BY_PERSON,
	VEHICLE_CATALOG,
	WIZARD_STEPS
} from '../constants/newPolicyWizardConfig';
import { toMockFileName } from '../helpers/newPolicyWizard';
import type { ChecklistEntry, WizardPayload } from '../types/newPolicyWizard';

type UseNewPolicyWizardArgs = {
	onClose: () => void;
	onSave: (payload: WizardPayload) => void;
};

export const useNewPolicyWizard = ({ onClose, onSave }: UseNewPolicyWizardArgs) => {
	const [activeStep, setActiveStep] = useState(0);
	const [personType, setPersonType] = useState<PersonaType | null>(null);
	const [branch, setBranch] = useState<Ramo | null>(null);
	const [company, setCompany] = useState('');
	const [assignment, setAssignment] = useState('');
	const [clientData, setClientData] = useState<Record<string, string>>({});
	const [branchData, setBranchData] = useState<Record<string, string>>({});
	const [checklistState, setChecklistState] = useState<Record<string, ChecklistEntry>>({});
	const [generatedDocuments, setGeneratedDocuments] = useState<string[]>([]);
	const [stepError, setStepError] = useState('');

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

	const currentBranchFields = useMemo(() => {
		if (!branch) {
			return [];
		}

		return BRANCH_FIELDS_BY_BRANCH[branch];
	}, [branch]);

	const modelOptions = useMemo(() => {
		if (branch !== 'AUTOMOVIL') {
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
		setPersonType(null);
		setBranch(null);
		setCompany('');
		setAssignment('');
		setClientData({});
		setBranchData({});
		setChecklistState({});
		setGeneratedDocuments([]);
		setStepError('');
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const handleClientFieldChange = (key: string, value: string) => {
		setClientData((prev) => ({ ...prev, [key]: value }));
	};

	const handleBranchFieldChange = (key: string, value: string) => {
		setBranchData((prev) => {
			const next = { ...prev, [key]: value };

			if (key === 'vehicleBrand') {
				next.vehicleModel = '';
			}

			return next;
		});
	};

	const handleSelectPerson = (type: PersonaType) => {
		setPersonType(type);
		setStepError('');
		setActiveStep(1);
	};

	const ensureChecklistEntry = (item: DocumentItem): ChecklistEntry => {
		return (
			checklistState[item.key] ?? {
				delivered: false,
				hasExpiration: Boolean(item.hasExpirationDate),
				expirationDate: ''
			}
		);
	};

	const handleChecklistChange = (key: string, patch: Partial<ChecklistEntry>) => {
		setChecklistState((prev) => {
			const item = checklistItems.find((checkItem) => checkItem.key === key);
			const baseEntry: ChecklistEntry = prev[key] ?? {
				delivered: false,
				hasExpiration: Boolean(item?.hasExpirationDate),
				expirationDate: ''
			};

			return {
				...prev,
				[key]: {
					...baseEntry,
					...patch
				}
			};
		});
	};

	const validateDataStep = (): boolean => {
		if (!branch) {
			setStepError('Debes seleccionar un ramo.');
			return false;
		}

		if (!company || !assignment) {
			setStepError('Selecciona compania y asignacion.');
			return false;
		}

		const missingClient = currentClientFields.filter((field) => field.required && !clientData[field.key]?.trim());

		if (missingClient.length > 0) {
			setStepError('Completa todos los datos requeridos del cliente.');
			return false;
		}

		const missingBranch = currentBranchFields.filter((field) => field.required && !branchData[field.key]?.trim());

		if (missingBranch.length > 0) {
			setStepError('Completa todos los datos requeridos del ramo.');
			return false;
		}

		if (branch === 'AUTOMOVIL' && !modelOptions.includes(branchData.vehicleModel ?? '')) {
			setStepError('Selecciona un modelo valido segun la marca.');
			return false;
		}

		return true;
	};

	const validateChecklistStep = (): boolean => {
		const deliveredCount = checklistItems.filter((item) => checklistState[item.key]?.delivered).length;

		if (deliveredCount === 0) {
			setStepError('Marca al menos un documento entregado para continuar.');
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
			setStepError('Si marcas vencimiento, debes ingresar una fecha.');
			return false;
		}

		return true;
	};

	const validateStep = (): boolean => {
		setStepError('');

		switch (WIZARD_STEPS[activeStep].key) {
			case 'person': {
				if (!personType) {
					setStepError('Selecciona tipo de persona para continuar.');
					return false;
				}

				return true;
			}
			case 'data':
				return validateDataStep();
			case 'checklist':
				return validateChecklistStep();
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!validateStep()) {
			return;
		}

		setActiveStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
	};

	const handleBack = () => {
		setStepError('');
		setActiveStep((prev) => Math.max(prev - 1, 0));
	};

	const handleGenerateMockDocuments = () => {
		const documents = checklistItems
			.filter((item) => checklistState[item.key]?.delivered)
			.map((item) => toMockFileName(item.key));

		setGeneratedDocuments(documents);
	};

	const handleSave = () => {
		if (!personType || !branch) {
			return;
		}

		onSave({
			personType,
			branch,
			company,
			assignment,
			clientData,
			branchData,
			checklist: checklistState,
			generatedDocuments
		});

		handleClose();
	};

	const stepLabel = `Paso ${activeStep + 1} de ${WIZARD_STEPS.length}`;
	const progressValue = ((activeStep + 1) / WIZARD_STEPS.length) * 100;
	const isSummaryStep = WIZARD_STEPS[activeStep].key === 'summary';

	return {
		activeStep,
		stepError,
		stepLabel,
		progressValue,
		isSummaryStep,
		personType,
		branch,
		company,
		assignment,
		clientData,
		branchData,
		checklistState,
		checklistItems,
		generatedDocuments,
		currentClientFields,
		currentBranchFields,
		modelOptions,
		setCompany,
		setAssignment,
		setBranch,
		handleClose,
		handleBack,
		handleNext,
		handleSave,
		handleSelectPerson,
		handleClientFieldChange,
		handleBranchFieldChange,
		handleChecklistChange,
		handleGenerateMockDocuments,
		ensureChecklistEntry
	};
};
