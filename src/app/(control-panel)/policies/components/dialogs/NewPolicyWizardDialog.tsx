import { useMemo, useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Checkbox,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	InputLabel,
	LinearProgress,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import {
	assignmentOptions,
	checklistConfig,
	companyOptions,
	type DocumentItem,
	type PersonaType,
	type Ramo
} from '../../data/dataConfig';

type StepKey = 'person' | 'data' | 'checklist' | 'summary';

type FieldKind = 'text' | 'date' | 'number' | 'select';

type FormField = {
	key: string;
	label: string;
	required: boolean;
	kind?: FieldKind;
	options?: string[];
};

type ChecklistEntry = {
	delivered: boolean;
	category: string;
	hasExpiration: boolean;
	expirationDate: string;
};

type WizardPayload = {
	personType: PersonaType;
	branch: Ramo;
	company: string;
	assignment: string;
	clientData: Record<string, string>;
	branchData: Record<string, string>;
	checklist: Record<string, ChecklistEntry>;
	generatedDocuments: string[];
};

type Props = {
	open: boolean;
	onClose: () => void;
	onSave: (payload: WizardPayload) => void;
};

const steps: { key: StepKey; title: string; description: string }[] = [
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

const personCards: { value: PersonaType; title: string; description: string }[] = [
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

const branchCards: { value: Ramo; title: string; description: string }[] = [
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

const vehicleCatalog: Record<string, string[]> = {
	Toyota: ['Hilux', 'Corolla', 'Yaris', 'RAV4'],
	Nissan: ['Frontier', 'Sentra', 'Versa', 'X-Trail'],
	Hyundai: ['Tucson', 'Accent', 'Elantra', 'Santa Fe'],
	Kia: ['Sportage', 'Rio', 'Sorento', 'Picanto'],
	Chevrolet: ['Colorado', 'Spark', 'Tracker', 'D-Max']
};

const vehicleBrands = Object.keys(vehicleCatalog);

const vehicleYears = Array.from({ length: 30 }, (_, index) => `${new Date().getFullYear() - index}`);

const categoryOptions = ['Cliente', 'Riesgo', 'Poliza'];

const clientFieldsByPerson: Record<PersonaType, FormField[]> = {
	NATURAL: [
		{ key: 'fullName', label: 'Nombre completo', required: true },
		{ key: 'idNumber', label: 'Cedula', required: true },
		{ key: 'birthMonth', label: 'Mes de nacimiento', required: true, kind: 'select', options: months },
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

const branchFieldsByBranch: Record<Ramo, FormField[]> = {
	SOA: [
		{ key: 'policyNumber', label: 'Numero de poliza', required: true },
		{ key: 'startDate', label: 'Inicio de vigencia', required: true, kind: 'date' },
		{ key: 'endDate', label: 'Fin de vigencia', required: true, kind: 'date' },
		{ key: 'insuredVehicle', label: 'Descripcion del bien', required: true }
	],
	AUTOMOVIL: [
		{ key: 'policyNumber', label: 'Numero de poliza', required: true },
		{ key: 'plate', label: 'Placa', required: true },
		{ key: 'vehicleBrand', label: 'Marca', required: true, kind: 'select', options: vehicleBrands },
		{ key: 'vehicleModel', label: 'Modelo', required: true, kind: 'select' },
		{ key: 'vehicleYear', label: 'Anio', required: true, kind: 'select', options: vehicleYears },
		{ key: 'insuredAmount', label: 'Suma asegurada', required: true, kind: 'number' },
		{ key: 'startDate', label: 'Inicio de vigencia', required: true, kind: 'date' },
		{ key: 'endDate', label: 'Fin de vigencia', required: true, kind: 'date' }
	]
};

const mapTypeToCategory = (type: DocumentItem['type']): string => {
	switch (type) {
		case 'CLIENT':
			return 'Cliente';
		case 'RISK':
			return 'Riesgo';
		case 'POLICY':
		default:
			return 'Poliza';
	}
};

const toMockFileName = (itemKey: string): string => {
	return `${itemKey}.pdf`;
};

const renderDynamicField = (
	field: FormField,
	value: string,
	onChange: (next: string) => void,
	optionsOverride?: string[]
) => {
	const options = optionsOverride ?? field.options ?? [];

	if (field.kind === 'select') {
		return (
			<FormControl fullWidth required={field.required}>
				<InputLabel>{field.label}</InputLabel>
				<Select
					label={field.label}
					value={value}
					onChange={(event) => onChange(event.target.value)}
				>
					{options.map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	}

	let inputType: 'text' | 'date' | 'number' = 'text';

	if (field.kind === 'date') {
		inputType = 'date';
	}

	if (field.kind === 'number') {
		inputType = 'number';
	}

	return (
		<TextField
			fullWidth
			label={field.label}
			required={field.required}
			type={inputType}
			slotProps={{ inputLabel: field.kind === 'date' ? { shrink: true } : undefined }}
			value={value}
			onChange={(event) => onChange(event.target.value)}
		/>
	);
};

export const NewPolicyWizardDialog = ({ open, onClose, onSave }: Props) => {
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

		return clientFieldsByPerson[personType];
	}, [personType]);

	const currentBranchFields = useMemo(() => {
		if (!branch) {
			return [];
		}

		return branchFieldsByBranch[branch];
	}, [branch]);

	const modelOptions = useMemo(() => {
		if (branch !== 'AUTOMOVIL') {
			return [];
		}

		const selectedBrand = branchData.vehicleBrand;
		if (!selectedBrand) {
			return [];
		}

		return vehicleCatalog[selectedBrand] ?? [];
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
				category: mapTypeToCategory(item.type),
				hasExpiration: false,
				expirationDate: ''
			}
		);
	};

	const handleChecklistChange = (key: string, patch: Partial<ChecklistEntry>) => {
		setChecklistState((prev) => {
			const next = {
				...prev,
				[key]: {
					...prev[key],
					...patch
				}
			};

			if (!next[key].category) {
				next[key].category = 'Cliente';
			}

			return next;
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

		switch (steps[activeStep].key) {
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

		setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
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

	const renderPersonStep = () => {
		return (
			<Grid container spacing={2}>
				{personCards.map((option) => (
					<Grid size={{ xs: 12, md: 6 }} key={option.value}>
						<Card variant="outlined" sx={{ borderRadius: 3, transition: 'all .2s', '&:hover': { boxShadow: 4 } }}>
							<CardActionArea onClick={() => handleSelectPerson(option.value)} sx={{ p: 1 }}>
								<CardContent>
									<Typography variant="h6" fontWeight={800}>
										{option.title}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
										{option.description}
									</Typography>
									<Typography variant="caption" color="secondary.main" sx={{ mt: 1.5, display: 'block' }}>
										Click para continuar
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
		);
	};

	const renderDataStep = () => {
		if (!personType) {
			return <Alert severity="info">Primero selecciona el tipo de persona.</Alert>;
		}

		return (
			<Stack spacing={2.5}>
				<Paper variant="outlined" sx={{ p: 2.2, borderRadius: 3 }}>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, md: 6 }}>
							<FormControl fullWidth required>
								<InputLabel>Compania</InputLabel>
								<Select label="Compania" value={company} onChange={(event) => setCompany(event.target.value)}>
									{companyOptions.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<FormControl fullWidth required>
								<InputLabel>Asignacion</InputLabel>
								<Select
									label="Asignacion"
									value={assignment}
									onChange={(event) => setAssignment(event.target.value)}
								>
									{assignmentOptions.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</Paper>

				<Typography variant="subtitle2" color="text.secondary">
					Selecciona el ramo
				</Typography>
				<Grid container spacing={2}>
					{branchCards.map((option) => {
						const selected = branch === option.value;
						return (
							<Grid size={{ xs: 12, md: 6 }} key={option.value}>
								<Card
									variant="outlined"
									sx={{
										borderRadius: 3,
										borderColor: selected ? 'secondary.main' : 'divider',
										boxShadow: selected ? 3 : 0
									}}
								>
									<CardActionArea onClick={() => setBranch(option.value)}>
										<CardContent>
											<Typography variant="h6" fontWeight={700}>
												{option.title}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{option.description}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						);
					})}
				</Grid>

				<Divider />

				<Typography variant="subtitle2" color="text.secondary">
					Datos del cliente
				</Typography>
				<Grid container spacing={2}>
					{currentClientFields.map((field) => (
						<Grid size={{ xs: 12, md: 6 }} key={field.key}>
							{renderDynamicField(field, clientData[field.key] ?? '', (next) => handleClientFieldChange(field.key, next))}
						</Grid>
					))}
				</Grid>

				{branch ? (
					<>
						<Divider />
						<Typography variant="subtitle2" color="text.secondary">
							Datos del ramo
						</Typography>
						<Grid container spacing={2}>
							{currentBranchFields.map((field) => {
								const optionsOverride = field.key === 'vehicleModel' ? modelOptions : undefined;

								return (
									<Grid size={{ xs: 12, md: 6 }} key={field.key}>
										{renderDynamicField(
											field,
											branchData[field.key] ?? '',
											(next) => handleBranchFieldChange(field.key, next),
											optionsOverride
										)}
									</Grid>
								);
							})}
						</Grid>
					</>
				) : null}
			</Stack>
		);
	};

	const renderChecklistStep = () => {
		if (!personType || !branch) {
			return <Alert severity="info">Completa el paso de datos para cargar el checklist.</Alert>;
		}

		return (
			<Stack spacing={2}>
				<Typography variant="body2" color="text.secondary">
					Checklist basado en documentos del Excel para {branch} {personType}.
				</Typography>

				{checklistItems.map((item) => {
					const state = ensureChecklistEntry(item);

					return (
						<Paper key={item.key} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
							<Grid container spacing={2} alignItems="center">
								<Grid size={{ xs: 12, md: 5 }}>
									<FormControlLabel
										control={
											<Checkbox
												checked={state.delivered}
												onChange={(_, checked) =>
													handleChecklistChange(item.key, {
														delivered: checked,
														hasExpiration: checked ? state.hasExpiration : false,
														expirationDate: checked ? state.expirationDate : ''
													})
												}
											/>
										}
										label={
											<Stack spacing={0.3}>
												<Typography fontWeight={700}>{item.label}</Typography>
												<Typography variant="caption" color="text.secondary">
													{item.required ? 'Requerido' : 'Opcional'}
												</Typography>
											</Stack>
										}
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 3 }}>
									<FormControl fullWidth size="small" disabled={!state.delivered}>
										<InputLabel>Categoria</InputLabel>
										<Select
											label="Categoria"
											value={state.category}
											onChange={(event) => handleChecklistChange(item.key, { category: event.target.value })}
										>
											{categoryOptions.map((option) => (
												<MenuItem key={option} value={option}>
													{option}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid size={{ xs: 12, md: 1.8 }}>
									<FormControlLabel
										control={
											<Checkbox
												disabled={!state.delivered}
												checked={state.hasExpiration}
												onChange={(_, checked) =>
													handleChecklistChange(item.key, {
														hasExpiration: checked,
														expirationDate: checked ? state.expirationDate : ''
													})
												}
											/>
										}
										label="Vence"
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 2.2 }}>
									<TextField
										fullWidth
										size="small"
										type="date"
										label="Fecha"
										slotProps={{ inputLabel: { shrink: true } }}
										disabled={!state.delivered || !state.hasExpiration}
										value={state.expirationDate}
										onChange={(event) =>
											handleChecklistChange(item.key, { expirationDate: event.target.value })
										}
									/>
								</Grid>
							</Grid>
						</Paper>
					);
				})}

				<Divider />

				<Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
					<Button variant="outlined" startIcon={<DescriptionIcon />} onClick={handleGenerateMockDocuments}>
						Generar documento mock
					</Button>
					<Typography variant="body2" color="text.secondary">
						Crea nombres mock usando documentos marcados como entregados.
					</Typography>
				</Stack>

				{generatedDocuments.length > 0 ? (
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
						<Typography variant="subtitle2" sx={{ mb: 1 }}>
							Documento mock generado
						</Typography>
						<Stack spacing={0.7}>
							{generatedDocuments.map((fileName) => (
								<Typography key={fileName} variant="body2">
									- {fileName}
								</Typography>
							))}
						</Stack>
					</Paper>
				) : null}
			</Stack>
		);
	};

	const renderSummaryStep = () => {
		const deliveredItems = checklistItems.filter((item) => checklistState[item.key]?.delivered);

		const renderFieldList = (fields: FormField[], data: Record<string, string>) => {
			return fields.map((field) => {
				const value = data[field.key]?.trim() || '-';
				return (
					<Stack key={field.key} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
						<Typography color="text.secondary">{field.label}</Typography>
						<Typography fontWeight={600}>{value}</Typography>
					</Stack>
				);
			});
		};

		return (
			<Stack spacing={2}>
				<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
					<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
						Datos principales
					</Typography>
					<Stack spacing={0.6}>
						<Stack direction="row" justifyContent="space-between">
							<Typography color="text.secondary">Tipo de persona</Typography>
							<Typography fontWeight={600}>{personType ?? '-'}</Typography>
						</Stack>
						<Stack direction="row" justifyContent="space-between">
							<Typography color="text.secondary">Ramo</Typography>
							<Typography fontWeight={600}>{branch ?? '-'}</Typography>
						</Stack>
						<Stack direction="row" justifyContent="space-between">
							<Typography color="text.secondary">Compania</Typography>
							<Typography fontWeight={600}>{company || '-'}</Typography>
						</Stack>
						<Stack direction="row" justifyContent="space-between">
							<Typography color="text.secondary">Asignacion</Typography>
							<Typography fontWeight={600}>{assignment || '-'}</Typography>
						</Stack>
					</Stack>
				</Paper>

				<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
					<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
						Cliente
					</Typography>
					<Stack>{renderFieldList(currentClientFields, clientData)}</Stack>
				</Paper>

				<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
					<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
						Ramo
					</Typography>
					<Stack>{renderFieldList(currentBranchFields, branchData)}</Stack>
				</Paper>

				<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
					<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
						Documentos entregados
					</Typography>
					{deliveredItems.length > 0 ? (
						<Stack spacing={0.7}>
							{deliveredItems.map((item) => {
								const state = checklistState[item.key];
								const expirationText = state?.hasExpiration ? ` - vence ${state.expirationDate || 'sin fecha'}` : '';

								return (
									<Typography key={item.key} variant="body2">
										- {item.label} ({state?.category || 'Cliente'}){expirationText}
									</Typography>
								);
							})}
						</Stack>
					) : (
						<Typography color="text.secondary">No hay documentos marcados.</Typography>
					)}
				</Paper>

				<Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
					<Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
						Documento mock
					</Typography>
					{generatedDocuments.length > 0 ? (
						<Stack spacing={0.7}>
							{generatedDocuments.map((name) => (
								<Typography key={name} variant="body2">
									- {name}
								</Typography>
							))}
						</Stack>
					) : (
						<Typography color="text.secondary">No se genero documento mock aun.</Typography>
					)}
				</Paper>
			</Stack>
		);
	};

	const renderStepContent = () => {
		switch (steps[activeStep].key) {
			case 'person':
				return renderPersonStep();
			case 'data':
				return renderDataStep();
			case 'checklist':
				return renderChecklistStep();
			case 'summary':
			default:
				return renderSummaryStep();
		}
	};

	const stepLabel = `Paso ${activeStep + 1} de ${steps.length}`;
	const progressValue = ((activeStep + 1) / steps.length) * 100;
	const isSummaryStep = steps[activeStep].key === 'summary';

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle sx={{ pr: 6 }}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="h5" fontWeight={800}>
						Nuevo Cliente + Poliza
					</Typography>
					<Chip size="small" color="secondary" label={stepLabel} />
				</Stack>
				<IconButton onClick={handleClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pb: 2 }}>
				<Stack spacing={2.2}>
					<Box>
						<LinearProgress variant="determinate" value={progressValue} sx={{ height: 9, borderRadius: 99 }} />
						<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
							{steps[activeStep].title}: {steps[activeStep].description}
						</Typography>
					</Box>

					{stepError ? <Alert severity="warning">{stepError}</Alert> : null}

					<Box>{renderStepContent()}</Box>

					<Divider />

					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Button variant="text" onClick={handleBack} disabled={activeStep === 0}>
							Atras
						</Button>

						<Stack direction="row" spacing={1}>
							<Button variant="outlined" color="inherit" onClick={handleClose}>
								Cancelar
							</Button>
							{isSummaryStep ? (
								<Button variant="contained" color="secondary" onClick={handleSave}>
									Guardar
								</Button>
							) : (
								<Button variant="contained" color="secondary" onClick={handleNext}>
									Siguiente
								</Button>
							)}
						</Stack>
					</Box>
				</Stack>
			</DialogContent>
		</Dialog>
	);
};
