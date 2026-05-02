import { MOCK_CUSTOMER } from "../../data/clientMock";
import { Box, Typography } from "@mui/material";

export const CustomerStats = ({ customer }: { customer: typeof MOCK_CUSTOMER }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={700} color="info.main">
          {customer.stats.totalPolicies}
        </Typography>
        <Typography variant="caption" color="info.main">
          Pólizas
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} color="warning.main">
          {customer.stats.totalClaims}
        </Typography>
        <Typography variant="caption" color="warning.main">
          Reclamos
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={700} color="success.main">
          {customer.stats.activePolicies}
        </Typography>
        <Typography variant="caption" color="success.main">
          Activas
        </Typography>
      </Box>
    </Box>
  );
};
