import { MOCK_CUSTOMER } from "../../data/clientMock";
import { Box, Stack, Typography } from "@mui/material";
import { EmailIcon, PhoneIcon } from "../../data/icons";

export const ContactInfo = ({
  customer,
}: {
  customer: typeof MOCK_CUSTOMER;
}) => {
  return (
    <Stack spacing={1}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, letterSpacing: 0.5 }}
      >
        INFORMACIÓN DE CONTACTO
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <EmailIcon fontSize="small" color="action" />
        <Typography variant="body2">{customer.email}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PhoneIcon fontSize="small" color="action" />
        <Typography variant="body2">{customer.phone}</Typography>
      </Box>
    </Stack>
  );
};
