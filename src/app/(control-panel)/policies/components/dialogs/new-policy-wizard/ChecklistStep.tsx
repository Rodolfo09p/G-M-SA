import DescriptionIcon from '@mui/icons-material/Description';
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Divider,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography
} from '@mui/material';
import type { DocumentItem, PersonaType, Ramo } from '../../../data/dataConfig';
import type { ChecklistEntry } from '../../../types/newPolicyWizard';

type Props = {
	personType: PersonaType | null;
	branch: Ramo | null;
	checklistItems: DocumentItem[];
	generatedDocuments: string[];
	ensureChecklistEntry: (item: DocumentItem) => ChecklistEntry;
	onChecklistChange: (key: string, patch: Partial<ChecklistEntry>) => void;
	onGenerateMockDocuments: () => void;
};

export const ChecklistStep = ({
	personType,
	branch,
	checklistItems,
	generatedDocuments,
	ensureChecklistEntry,
	onChecklistChange,
	onGenerateMockDocuments
}: Props) => {
	if (!personType || !branch) {
		return <Alert severity="info">Completa el paso de datos para cargar el checklist.</Alert>;
	}

	return (
		<Stack spacing={2}>
			<Typography
				variant="body2"
				color="text.secondary"
			>
				Checklist documental para {branch} - {personType}.
			</Typography>

			<TableContainer
				component={Paper}
				variant="outlined"
				sx={{ borderRadius: 3 }}
			>
				<Table
					size="small"
					sx={{ minWidth: 680 }}
				>
					<TableHead>
						<TableRow>
							<TableCell width="12%">Req</TableCell>
							<TableCell width="53%">Documento</TableCell>
							<TableCell width="15%">Entregado</TableCell>
							<TableCell width="20%">Fecha venc.</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{checklistItems.map((item) => {
							const state = ensureChecklistEntry(item);

							return (
								<TableRow
									key={item.key}
									hover
								>
									<TableCell>
										<Checkbox
											checked={item.required}
											disabled
										/>
									</TableCell>
									<TableCell>
										<Typography fontWeight={600}>{item.label}</Typography>
									</TableCell>
									<TableCell>
										<Checkbox
											checked={state.delivered}
											onChange={(_, checked) =>
												onChecklistChange(item.key, {
													delivered: checked,
													hasExpiration: state.hasExpiration,
													expirationDate: checked ? state.expirationDate : ''
												})
											}
										/>
									</TableCell>
									<TableCell>
										{state.hasExpiration ? (
											<TextField
												fullWidth
												size="medium"
												type="date"
												slotProps={{ inputLabel: { shrink: true } }}
												value={state.expirationDate}
												onChange={(event) =>
													onChecklistChange(item.key, {
														expirationDate: event.target.value
													})
												}
											/>
										) : (
											<Typography
												variant="body2"
												color="text.secondary"
											>
												-
											</Typography>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<Divider />

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={1.5}
				alignItems={{ xs: 'stretch', md: 'center' }}
			>
				<Button
					variant="outlined"
					startIcon={<DescriptionIcon />}
					onClick={onGenerateMockDocuments}
				>
					Generar documento mock
				</Button>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					Crea nombres mock usando documentos marcados como entregados.
				</Typography>
			</Stack>

			{generatedDocuments.length > 0 ? (
				<Paper
					variant="outlined"
					sx={{ p: 2, borderRadius: 3 }}
				>
					<Typography
						variant="subtitle2"
						sx={{ mb: 1 }}
					>
						Documento mock generado
					</Typography>
					<Stack spacing={0.7}>
						{generatedDocuments.map((fileName) => (
							<Typography
								key={fileName}
								variant="body2"
							>
								- {fileName}
							</Typography>
						))}
					</Stack>
				</Paper>
			) : null}

			<Box>
				<Typography
					variant="caption"
					color="text.secondary"
				>
					Req y Vence vienen definidos por configuracion para cada ramo y tipo de cliente.
				</Typography>
			</Box>
		</Stack>
	);
};
