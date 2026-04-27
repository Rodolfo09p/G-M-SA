import { Paper, Stack, Typography } from '@mui/material';
import type { DocumentItem } from '../../../data/dataConfig';
import type { ChecklistEntry, FormField } from '../../../types/newPolicyWizard';

type Props = {
	personType: string | null;
	branch: string | null;
	company: string;
	assignment: string;
	currentClientFields: FormField[];
	clientData: Record<string, string>;
	currentBranchFields: FormField[];
	branchData: Record<string, string>;
	checklistItems: DocumentItem[];
	checklistState: Record<string, ChecklistEntry>;
	generatedDocuments: string[];
};

const SummaryFieldList = ({ fields, data }: { fields: FormField[]; data: Record<string, string> }) => {
	return (
		<Stack>
			{fields.map((field) => {
				const value = data[field.key]?.trim() || '-';

				return (
					<Stack
						key={field.key}
						direction="row"
						justifyContent="space-between"
						sx={{ py: 0.5 }}
					>
						<Typography color="text.secondary">{field.label}</Typography>
						<Typography fontWeight={600}>{value}</Typography>
					</Stack>
				);
			})}
		</Stack>
	);
};

export const SummaryStep = ({
	personType,
	branch,
	company,
	assignment,
	currentClientFields,
	clientData,
	currentBranchFields,
	branchData,
	checklistItems,
	checklistState,
	generatedDocuments
}: Props) => {
	const deliveredItems = checklistItems.filter((item) => checklistState[item.key]?.delivered);

	return (
		<Stack spacing={2}>
			<Paper
				variant="outlined"
				sx={{ p: 2, borderRadius: 3 }}
			>
				<Typography
					variant="subtitle1"
					fontWeight={700}
					sx={{ mb: 1 }}
				>
					Datos principales
				</Typography>
				<Stack spacing={0.6}>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Typography color="text.secondary">Tipo de persona</Typography>
						<Typography fontWeight={600}>{personType ?? '-'}</Typography>
					</Stack>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Typography color="text.secondary">Ramo</Typography>
						<Typography fontWeight={600}>{branch ?? '-'}</Typography>
					</Stack>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Typography color="text.secondary">Compania</Typography>
						<Typography fontWeight={600}>{company || '-'}</Typography>
					</Stack>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Typography color="text.secondary">Asignacion</Typography>
						<Typography fontWeight={600}>{assignment || '-'}</Typography>
					</Stack>
				</Stack>
			</Paper>

			<Paper
				variant="outlined"
				sx={{ p: 2, borderRadius: 3 }}
			>
				<Typography
					variant="subtitle1"
					fontWeight={700}
					sx={{ mb: 1 }}
				>
					Cliente
				</Typography>
				<SummaryFieldList
					fields={currentClientFields}
					data={clientData}
				/>
			</Paper>

			<Paper
				variant="outlined"
				sx={{ p: 2, borderRadius: 3 }}
			>
				<Typography
					variant="subtitle1"
					fontWeight={700}
					sx={{ mb: 1 }}
				>
					Ramo
				</Typography>
				<SummaryFieldList
					fields={currentBranchFields}
					data={branchData}
				/>
			</Paper>

			<Paper
				variant="outlined"
				sx={{ p: 2, borderRadius: 3 }}
			>
				<Typography
					variant="subtitle1"
					fontWeight={700}
					sx={{ mb: 1 }}
				>
					Documentos entregados
				</Typography>
				{deliveredItems.length > 0 ? (
					<Stack spacing={0.7}>
						{deliveredItems.map((item) => {
							const state = checklistState[item.key];
							const expirationText = state?.hasExpiration
								? ` - vence ${state.expirationDate || 'sin fecha'}`
								: '';

							return (
								<Typography
									key={item.key}
									variant="body2"
								>
									- {item.label}
									{expirationText}
								</Typography>
							);
						})}
					</Stack>
				) : (
					<Typography color="text.secondary">No hay documentos marcados.</Typography>
				)}
			</Paper>

			<Paper
				variant="outlined"
				sx={{ p: 2, borderRadius: 3 }}
			>
				<Typography
					variant="subtitle1"
					fontWeight={700}
					sx={{ mb: 1 }}
				>
					Documento mock
				</Typography>
				{generatedDocuments.length > 0 ? (
					<Stack spacing={0.7}>
						{generatedDocuments.map((name) => (
							<Typography
								key={name}
								variant="body2"
							>
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
