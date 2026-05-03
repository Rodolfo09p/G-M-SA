import CloseIcon from '@mui/icons-material/Close';
import {
	Alert,
	Box,
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	LinearProgress,
	Stack,
	Typography
} from '@mui/material';
import { WIZARD_STEPS } from '../../constants/newPolicyWizardConfig';
import { useNewPolicyWizard } from '../../hooks/useNewPolicyWizard';
import type { WizardPayload } from '../../types/newPolicyWizard';
import { ChecklistStep } from './new-policy-wizard/ChecklistStep';
import { DataStep } from './new-policy-wizard/DataStep';
import { PersonStep } from './new-policy-wizard/PersonStep';
import { SummaryStep } from './new-policy-wizard/SummaryStep';

type Props = {
	open: boolean;
	onClose: () => void;
	onSave: (payload: WizardPayload) => void;
};

export const NewPolicyWizardDialog = ({ open, onClose, onSave }: Props) => {
	const {
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
	} = useNewPolicyWizard({ onClose, onSave });

	const renderStepContent = () => {
		switch (WIZARD_STEPS[activeStep].key) {
			case 'person':
				return <PersonStep onSelectPerson={handleSelectPerson} />;
			case 'data':
				return (
					<DataStep
						personType={personType}
						branch={branch}
						company={company}
						assignment={assignment}
						clientData={clientData}
						branchData={branchData}
						currentClientFields={currentClientFields}
						currentBranchFields={currentBranchFields}
						modelOptions={modelOptions}
						setCompany={setCompany}
						setAssignment={setAssignment}
						setBranch={setBranch}
						onClientFieldChange={handleClientFieldChange}
						onBranchFieldChange={handleBranchFieldChange}
					/>
				);
			case 'checklist':
				return (
					<ChecklistStep
						personType={personType}
						branch={branch}
						checklistItems={checklistItems}
						generatedDocuments={generatedDocuments}
						ensureChecklistEntry={ensureChecklistEntry}
						onChecklistChange={handleChecklistChange}
						onGenerateMockDocuments={handleGenerateMockDocuments}
					/>
				);
			case 'summary':
			default:
				return (
					<SummaryStep
						personType={personType}
						branch={branch}
						company={company}
						assignment={assignment}
						currentClientFields={currentClientFields}
						clientData={clientData}
						currentBranchFields={currentBranchFields}
						branchData={branchData}
						checklistItems={checklistItems}
						checklistState={checklistState}
						generatedDocuments={generatedDocuments}
					/>
				);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle sx={{ pr: 6 }}>
				<Stack
					direction="row"
					alignItems="center"
					spacing={1}
				>
					<Typography
						variant="h5"
						fontWeight={800}
					>
						Nuevo Cliente + Poliza
					</Typography>
					<Chip
						size="small"
						color="secondary"
						label={stepLabel}
					/>
				</Stack>
				<IconButton
					onClick={handleClose}
					sx={{ position: 'absolute', right: 12, top: 12 }}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ pb: 2 }}>
				<Stack spacing={2.2}>
					<Box>
						<LinearProgress
							variant="determinate"
							value={progressValue}
							sx={{ height: 9, borderRadius: 99 }}
						/>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mt: 1 }}
						>
							{WIZARD_STEPS[activeStep].description}
						</Typography>
					</Box>

					{stepError ? <Alert severity="warning">{stepError}</Alert> : null}

					<Box>{renderStepContent()}</Box>

					<Divider />

					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Button
							variant="text"
							onClick={handleBack}
							disabled={activeStep === 0}
						>
							Atras
						</Button>

						<Stack
							direction="row"
							spacing={1}
						>
							<Button
								variant="outlined"
								color="inherit"
								onClick={handleClose}
							>
								Cancelar
							</Button>
							{isSummaryStep ? (
								<Button
									variant="contained"
									color="secondary"
									onClick={handleSave}
								>
									Guardar
								</Button>
							) : (
								<Button
									variant="contained"
									color="secondary"
									onClick={handleNext}
								>
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
