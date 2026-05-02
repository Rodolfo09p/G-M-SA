import { MOCK_CUSTOMER } from "../../data/clientMock";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { ContactInfo } from "./ContactInfo";
import { CustomerStats } from "./CustomerStats";

export const CustomerCard = ({
  customer,
}: {
  customer: typeof MOCK_CUSTOMER;
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Stack direction="row" spacing={1} mb={2}>
          <Chip label={customer.type} color="info" size="small" />
          <Chip
            label={customer.status}
            color="success"
            size="small"
            variant="outlined"
          />
        </Stack>

        <Typography variant="h5" fontWeight={600}>
          {customer.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1}>
          {customer.id}
        </Typography>

        <Divider sx={{ my: 2 }} />
        {/* info */}
        <ContactInfo customer={customer} />

        <Divider sx={{ my: 2 }} />
        <CustomerStats customer={customer} />
      </CardContent>
    </Card>
  );
};
