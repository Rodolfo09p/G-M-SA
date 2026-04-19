import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CollectionsBreakdownItem, MonthlyCollectionsBarItem } from "../../types/dashboardTypes";

type CollectionsStatusChartsCardProps = {
  barData: MonthlyCollectionsBarItem[];
  pieData: CollectionsBreakdownItem[];
};

export const CollectionsStatusChartsCard = (props: Readonly<CollectionsStatusChartsCardProps>) => {
  const { barData, pieData } = props;
  const theme = useTheme();
  const pieChartData = pieData.map((item) => ({ ...item, fill: item.color }));

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          Estado de cobranza mensual
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 3fr) minmax(0, 2fr)",
            },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Cobranza vs mora por mes
            </Typography>

            <Box sx={{ height: 260, p: 1.5, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={6}>
                  <CartesianGrid vertical={false} stroke={theme.vars.palette.divider} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: theme.vars.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.vars.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: theme.vars.palette.divider,
                      backgroundColor: theme.vars.palette.background.paper,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="collected" name="Cobrado" fill="#66BB6A" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="arrears" name="Mora" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Distribucion actual
            </Typography>

            <Box
              sx={{
                height: 260,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: "action.hover",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieChartData} dataKey="percent" nameKey="label" innerRadius={46} outerRadius={74} paddingAngle={2} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        borderColor: theme.vars.palette.divider,
                        backgroundColor: theme.vars.palette.background.paper,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                Cobrado: {pieData[0]?.percent ?? 0}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
