"use client";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DashboardMetricCard } from "../cards/DashboardMetricCard";
import { CollectionsStatusChartsCard } from "../cards/CollectionsStatusChartsCard";
import { RenewalPriorityTimelineCard } from "../cards/RenewalPriorityTimelineCard";
import {
  collectionsBreakdownData,
  dashboardMetricCards,
  monthlyCollectionsBarData,
  renewalPriorityData,
} from "../../data/dashboardMockData";

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

function DashboardView() {
  const currentDateLabel = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <Root
      header={
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 1,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Bienvenido de nuevo, Rodolfo!
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textTransform: "capitalize" }}
          >
            {currentDateLabel}
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
            {dashboardMetricCards.map((cardItem) => (
              <DashboardMetricCard key={cardItem.title} item={cardItem} />
            ))}
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(0, 3fr) minmax(0, 2fr)",
              },
            }}
          >
            <CollectionsStatusChartsCard
              barData={monthlyCollectionsBarData}
              pieData={collectionsBreakdownData}
            />

            <RenewalPriorityTimelineCard data={renewalPriorityData} />
          </Box>
        </Box>
      }
    />
  );
}

export default DashboardView;
