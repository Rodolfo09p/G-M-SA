import type { DocumentItem, PersonaType, Ramo } from '../data/dataConfig';

export type StepKey = 'person' | 'data' | 'checklist' | 'summary';

export type FieldKind = 'text' | 'date' | 'number' | 'select';

export type FormField = {
	key: string;
	label: string;
	required: boolean;
	kind?: FieldKind;
	options?: string[];
};

export type ChecklistEntry = {
	delivered: boolean;
	category: string;
	hasExpiration: boolean;
	expirationDate: string;
};

export type WizardPayload = {
	personType: PersonaType;
	branch: Ramo;
	company: string;
	assignment: string;
	clientData: Record<string, string>;
	branchData: Record<string, string>;
	checklist: Record<string, ChecklistEntry>;
	generatedDocuments: string[];
};

export type WizardStep = {
	key: StepKey;
	title: string;
	description: string;
};

export type PersonCardOption = {
	value: PersonaType;
	title: string;
	description: string;
};

export type BranchCardOption = {
	value: Ramo;
	title: string;
	description: string;
};

export type ChecklistItems = DocumentItem[];
