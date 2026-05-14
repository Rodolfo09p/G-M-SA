"use client";

import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { PageLayout, useAppFeedback } from "@/components";

type ReportCard = {
  id: string;
  title: string;
  summary: string;
  frequency: string;
};

const reportCards: ReportCard[] = [
  {
    id: "collections-summary",
    title: "Cobranza - Resumen Ejecutivo",
    summary: "KPIs de mora y recuperación",
    frequency: "Semanal",
  },
  {
    id: "collections-collector",
    title: "Cobranza por Gestor",
    summary: "Productividad por ejecutivo",
    frequency: "Diario",
  },
  {
    id: "claims-control",
    title: "Reclamos - Control Operativo",
    summary: "Seguimiento de estados y pendientes",
    frequency: "Semanal",
  },
  {
    id: "policies-renewal",
    title: "Pólizas - Renovaciones",
    summary: "Vencimientos y tasa de renovación",
    frequency: "Semanal",
  },
];

const ReportsView = () => {
  const { showAlert } = useAppFeedback();

  return (
    <PageLayout
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Reportes más usados por el equipo.
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
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {reportCards.map((report) => (
              <Card key={report.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <AssessmentOutlinedIcon color="secondary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {report.title}
                    </Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                    {report.summary}
                  </Typography>

                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5, mb: 1.8 }}>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={report.frequency}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="text"
                      color="info"
                      onClick={() => {
                        showAlert({
                          icon: "info",
                          title: report.title,
                          text: "Vista previa disponible en la siguiente fase del demo.",
                        }).catch(() => undefined);
                      }}
                    >
                      Ver reporte
                    </Button>
                    <Button
                      size="small"
                      variant="text"
                      color="success"
                      startIcon={<DownloadOutlinedIcon fontSize="small" />}
                      onClick={() => {
                        showAlert({
                          icon: "success",
                          title: "Exportación simulada",
                          text: `Se generó archivo mock de: ${report.title}`,
                        }).catch(() => undefined);
                      }}
                    >
                      Exportar
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      }
    />
  );
};

export default ReportsView;
