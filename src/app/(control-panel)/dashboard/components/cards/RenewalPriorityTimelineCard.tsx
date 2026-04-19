import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { RenewalPriorityItem, RenewalPriorityLevel } from "../../types/dashboardTypes";

type RenewalPriorityTimelineCardProps = {
  data: RenewalPriorityItem[];
};

const getRenewalLevelMeta = (level: RenewalPriorityLevel) => {
  if (level === "critical") {
    return {
      icon: "lucide:circle-alert",
      color: "#EF5350",
      bgColor: "#EF53501A",
    };
  }

  if (level === "warning") {
    return {
      icon: "lucide:triangle-alert",
      color: "#F59E0B",
      bgColor: "#F59E0B1A",
    };
  }

  return {
    icon: "lucide:clock-3",
    color: "#FBC02D",
    bgColor: "#FBC02D1A",
  };
}

export const RenewalPriorityTimelineCard = (props: Readonly<RenewalPriorityTimelineCardProps>) => {
  const { data } = props;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Renovaciones prioritarias (Timeline)
        </Typography>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {data.map((item) => {
            const levelMeta = getRenewalLevelMeta(item.level);

            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                  <Box
                    sx={{
                      color: levelMeta.color,
                      bgcolor: levelMeta.bgColor,
                      borderRadius: 1,
                      p: 0.75,
                      display: "inline-flex",
                    }}
                  >
                    <FuseSvgIcon size={16}>{levelMeta.icon}</FuseSvgIcon>
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {item.clientName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.daysToDue} dias para vencimiento
                    </Typography>
                  </Box>
                </Box>

                <FuseSvgIcon size={16} color="action">
                  lucide:phone
                </FuseSvgIcon>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
