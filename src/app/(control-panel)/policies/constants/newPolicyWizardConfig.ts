import type { PersonaType, Ramo } from '../data/dataConfig';
import type { BranchCardOption, FormField, PersonCardOption, WizardStep } from '../types/newPolicyWizard';

export const WIZARD_STEPS: WizardStep[] = [
	{
		key: 'person',
		title: 'Tipo de persona',
		description: 'Selecciona el tipo de cliente para iniciar el flujo.'
	},
	{
		key: 'data',
		title: 'Datos y ramo',
		description: 'Completa cliente, ramo, compania y asignacion.'
	},
	{
		key: 'checklist',
		title: 'Checklist de documentos',
		description: 'Marca documentos entregados y genera el mock del documento.'
	},
	{
		key: 'summary',
		title: 'Resumen final',
		description: 'Verifica todo antes de guardar la gestion.'
	}
];

export const PERSON_CARDS: PersonCardOption[] = [
	{
		value: 'NATURAL',
		title: 'Cliente natural',
		description: 'Persona individual con datos personales y documentos personales.'
	},
	{
		value: 'JURIDICA',
		title: 'Cliente juridica',
		description: 'Empresa con representante legal, RUC y documentacion corporativa.'
	}
];

export const BRANCH_CARDS: BranchCardOption[] = [
	{
		value: 'SOA',
		title: 'SOA',
		description: 'Seguro obligatorio.'
	},
	{
		value: 'AUTOMOVIL',
		title: 'Automovil',
		description: 'Seguro de danos propios para vehiculo.'
	}
];

const months = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre'
];

export const VEHICLE_CATALOG: Record<string, string[]> = {
	Toyota: ['Hilux', 'Corolla', 'Yaris', 'RAV4'],
	Nissan: ['Frontier', 'Sentra', 'Versa', 'X-Trail'],
	Hyundai: ['Tucson', 'Accent', 'Elantra', 'Santa Fe'],
	Kia: ['Sportage', 'Rio', 'Sorento', 'Picanto'],
	Chevrolet: ['Colorado', 'Spark', 'Tracker', 'D-Max']
};

export const VEHICLE_BRANDS = Object.keys(VEHICLE_CATALOG);

export const VEHICLE_YEARS = Array.from({ length: 30 }, (_, index) => `${new Date().getFullYear() - index}`);

export const CHECKLIST_CATEGORY_OPTIONS = ['Cliente', 'Riesgo', 'Poliza'];

export const CLIENT_FIELDS_BY_PERSON: Record<PersonaType, FormField[]> = {
	NATURAL: [
		{ key: 'fullName', label: 'Nombre completo', required: true },
		{ key: 'idNumber', label: 'Cedula', required: true },
		{
			key: 'birthMonth',
			label: 'Mes de nacimiento',
			required: true,
			kind: 'select',
			options: months
		},
		{ key: 'phone', label: 'Telefono', required: true },
		{ key: 'email', label: 'Correo electronico', required: false },
		{ key: 'address', label: 'Direccion', required: true }
	],
	JURIDICA: [
		{ key: 'businessName', label: 'Razon social', required: true },
		{ key: 'ruc', label: 'RUC', required: true },
		{ key: 'legalRepresentative', label: 'Representante legal', required: true },
		{ key: 'phone', label: 'Telefono', required: true },
		{ key: 'email', label: 'Correo electronico', required: false },
		{ key: 'address', label: 'Direccion', required: true }
	]
};

export const BRANCH_FIELDS_BY_BRANCH: Record<Ramo, FormField[]> = {
	SOA: [
		{ key: 'policyNumber', label: 'Numero de poliza', required: true },
		{
			key: 'startDate',
			label: 'Inicio de vigencia',
			required: true,
			kind: 'date'
		},
		{ key: 'endDate', label: 'Fin de vigencia', required: true, kind: 'date' },
		{ key: 'insuredVehicle', label: 'Descripcion del bien', required: true }
	],
	AUTOMOVIL: [
		{ key: 'policyNumber', label: 'Numero de poliza', required: true },
		{ key: 'plate', label: 'Placa', required: true },
		{
			key: 'vehicleBrand',
			label: 'Marca',
			required: true,
			kind: 'select',
			options: VEHICLE_BRANDS
		},
		{ key: 'vehicleModel', label: 'Modelo', required: true, kind: 'select' },
		{
			key: 'vehicleYear',
			label: 'Anio',
			required: true,
			kind: 'select',
			options: VEHICLE_YEARS
		},
		{
			key: 'insuredAmount',
			label: 'Suma asegurada',
			required: true,
			kind: 'number'
		},
		{
			key: 'startDate',
			label: 'Inicio de vigencia',
			required: true,
			kind: 'date'
		},
		{ key: 'endDate', label: 'Fin de vigencia', required: true, kind: 'date' }
	]
};
