import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

type ManagementFlow = "new_customer_policy" | "add_policy" | "renew_policy";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (flow: ManagementFlow) => void;
};

export const NewManagementDialog = ({ open, onClose, onSelect }: Props) => {
  const options = [
    {
      value: "new_customer_policy",
      title: "Nuevo Cliente + Póliza",
      description: "Registra un cliente nuevo y crea su primera póliza",
      icon: <PersonAddAltIcon sx={{ fontSize: 30, color: "#1976d2" }} />,
    },
    {
      value: "add_policy",
      title: "Agregar Póliza a Cliente",
      description: "Selecciona un cliente existente y agrega una nueva póliza",
      icon: <AddIcon sx={{ fontSize: 30, color: "#1976d2" }} />,
    },
    {
      value: "renew_policy",
      title: "Renovar Póliza",
      description: "Renueva una póliza existente con los mismos detalles",
      icon: <RefreshIcon sx={{ fontSize: 30, color: "#1976d2" }} />,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        ¿Qué deseas hacer?
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecciona el flujo que mejor se adapte a tu necesidad
        </Typography>

        <Stack spacing={1.2}>
          {options.map((option) => (
            <Box
              key={option.value}
              onClick={() => onSelect(option.value as ManagementFlow)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-2px)",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {option.icon}
              </Box>

              <Box>
                <Typography fontWeight={600} fontSize={16}>
                  {option.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 13 }}
                >
                  {option.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
