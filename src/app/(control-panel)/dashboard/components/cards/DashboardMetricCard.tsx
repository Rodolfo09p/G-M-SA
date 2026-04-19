import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DashboardMetricCardItem } from "../../types/dashboardTypes";

type DashboardMetricCardProps = {
  item: DashboardMetricCardItem;
};

export const DashboardMetricCard = (props: Readonly<DashboardMetricCardProps>) => {
  const { item } = props;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {item.title}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ color: item.accentColor }}>
            {item.value}
          </Typography>

          <Box
            sx={{
              color: item.accentColor,
              bgcolor: `${item.accentColor}1A`,
              borderRadius: 1.5,
              p: 1,
              display: "inline-flex",
            }}
          >
            <FuseSvgIcon size={20}>{item.icon}</FuseSvgIcon>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
