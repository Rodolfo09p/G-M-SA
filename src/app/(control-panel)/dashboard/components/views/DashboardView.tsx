"use client";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.vars.palette.divider,
  },
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

type DashboardMetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: string;
  accentColor: string;
};

function DashboardMetricCard(props: Readonly<DashboardMetricCardProps>) {
  const { title, value, description, icon, accentColor } = props;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ color: accentColor }}>
            {value}
          </Typography>

          <Box
            sx={{
              color: accentColor,
              bgcolor: `${accentColor}1A`,
              borderRadius: 1.5,
              p: 1,
              display: "inline-flex",
            }}
          >
            <FuseSvgIcon size={20}>{icon}</FuseSvgIcon>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function DashboardView() {
  return (
    <Root
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            ¡Bienvenido de nuevo, Rodolfo!
          </Typography>
        </Box>
      }
      content={
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            <DashboardMetricCard
              title="Poliza por vencer (30)"
              value="42"
              description="Asegura renovaciones criticas"
              icon="lucide:calendar-days"
              accentColor="#EF5350"
            />

            <DashboardMetricCard
              title="Morosidad Actual"
              value="$12,480"
              description="Cartera en riesgo"
              icon="lucide:wallet"
              accentColor="#F59E0B"
            />

            <DashboardMetricCard
              title="Expedientes incompletos"
              value="18"
              description="Checklist de documentos"
              icon="lucide:clipboard-check"
              accentColor="#42A5F5"
            />

            <DashboardMetricCard
              title="Ventas mes"
              value="$28,750"
              description="Nuevas primas"
              icon="lucide:trending-up"
              accentColor="#66BB6A"
            />
          </Box>
        </Box>
      }
    />
  );
}

export default DashboardView;
