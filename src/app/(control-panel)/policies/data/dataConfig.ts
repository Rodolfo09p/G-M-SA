export type Ramo = 'SOA' | 'AUTOMOVIL';
export type PersonaType = 'NATURAL' | 'JURIDICA';

export type Compania = 'LAFISE' | 'INISER' | 'AMERICA' | 'ASSURANT' | 'MAPFRE';
export type AsignacionType = 'G&M' | 'AGENTE';

export type DocumentItem = {
	key: string;
	label: string;
	required: boolean;
	type: 'CLIENT' | 'RISK' | 'POLICY';
	hasExpirationDate?: boolean;
	order: number;
};

export type ChecklistConfig = Record<Ramo, Record<PersonaType, DocumentItem[]>>;

export const companyOptions: Compania[] = ['LAFISE', 'INISER', 'AMERICA', 'ASSURANT', 'MAPFRE'];

export const assignmentOptions: AsignacionType[] = ['G&M', 'AGENTE'];

export const checklistConfig: ChecklistConfig = {
	SOA: {
		NATURAL: [
			{
				key: 'cedula_identidad',
				label: 'Cedula de Identidad',
				required: true,
				type: 'CLIENT',
				hasExpirationDate: true,
				order: 1
			},
			{
				key: 'circulacion_vehiculo',
				label: 'Circulacion del Vehiculo',
				required: true,
				type: 'RISK',
				hasExpirationDate: true,
				order: 2
			}
		],
		JURIDICA: [
			{
				key: 'cedula_ruc_empresa',
				label: 'Cedula RUC de la Empresa',
				required: true,
				type: 'CLIENT',
				order: 1
			},
			{
				key: 'circulacion_vehiculo',
				label: 'Circulacion del Vehiculo',
				required: true,
				type: 'RISK',
				hasExpirationDate: true,
				order: 2
			}
		]
	},
	AUTOMOVIL: {
		NATURAL: [
			{
				key: 'cedula_identidad',
				label: 'Cedula de Identidad',
				required: true,
				type: 'CLIENT',
				hasExpirationDate: true,
				order: 1
			},
			{
				key: 'perfil_integral_cliente',
				label: 'Perfil Integral del Cliente',
				required: true,
				type: 'CLIENT',
				order: 2
			},
			{
				key: 'proforma_circulacion',
				label: 'Proforma o Circulacion',
				required: true,
				type: 'RISK',
				order: 3
			},
			{
				key: 'cotizacion_poliza',
				label: 'Cotizacion de Poliza',
				required: true,
				type: 'POLICY',
				order: 4
			},
			{
				key: 'solicitud_poliza',
				label: 'Solicitud de Poliza',
				required: true,
				type: 'POLICY',
				order: 5
			},
			{
				key: 'poliza_completa',
				label: 'Poliza Completa',
				required: true,
				type: 'POLICY',
				order: 6
			}
		],
		JURIDICA: [
			{
				key: 'cedula_representante_legal',
				label: 'Cedula de Representante Legal',
				required: true,
				type: 'CLIENT',
				hasExpirationDate: true,
				order: 1
			},
			{
				key: 'perfil_integral_cliente',
				label: 'Perfil Integral de Cliente',
				required: true,
				type: 'CLIENT',
				order: 2
			},
			{
				key: 'cedula_ruc',
				label: 'Cedula RUC',
				required: true,
				type: 'CLIENT',
				order: 3
			},
			{
				key: 'beneficiario_final',
				label: 'Beneficiario Final',
				required: true,
				type: 'CLIENT',
				order: 4
			},
			{
				key: 'poder_representacion',
				label: 'Poder de Representacion',
				required: true,
				type: 'CLIENT',
				order: 5
			},
			{
				key: 'acta_junta_directiva',
				label: 'Acta de Junta Directiva',
				required: true,
				type: 'CLIENT',
				order: 6
			},
			{
				key: 'permiso_operaciones',
				label: 'Permiso de Operaciones',
				required: true,
				type: 'CLIENT',
				order: 7
			},
			{
				key: 'proforma_circulacion',
				label: 'Proforma o Circulacion',
				required: true,
				type: 'RISK',
				order: 8
			},
			{
				key: 'poliza_completa',
				label: 'Poliza Completa',
				required: true,
				type: 'POLICY',
				order: 9
			}
		]
	}
};
