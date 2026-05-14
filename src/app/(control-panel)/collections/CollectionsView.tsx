"use client";

import { useMemo, useState } from "react";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { PageLayout, useAppFeedback } from "@/components";
import { DashboardMetricCard } from "../dashboard/components/cards/DashboardMetricCard";
import { CollectionsStatusChartsCard } from "../dashboard/components/cards/CollectionsStatusChartsCard";
import { CollectionCaseDrawer } from "./components/drawer/CollectionCaseDrawer";
import { getCollectionsColumns } from "./components/table/CollectionsColumns";
import { CollectionsTable } from "./components/table/CollectionsTable";
import {
  applyMockCollectionSnapshot,
  getCollectionChartsData,
  getCollectionDashboardMetrics,
  getCollectionImportHistory,
  getCurrentCollectionCases,
  getLatestImportedSnapshot,
  getPendingCollectionSnapshots,
  getRecoveredCollectionCases,
  recordCollectionFollowUp,
} from "./data/collectionsMockData";
import type { CollectionCaseView } from "./types/types";

const MIN_ACTION_DELAY_MS = 900;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

const syncOptions = [
  { label: "Todos", value: "all" },
  { label: "Nuevos", value: "new" },
  { label: "Persistentes", value: "persistent" },
  { label: "Actualizados", value: "updated" },
];

const formatSummary = (item: { newCases: number; updatedCases: number; recoveredCases: number; unchangedCases: number; }) => {
  return `Nuevos ${item.newCases} · Actualizados ${item.updatedCases} · Recuperados ${item.recoveredCases} · Sin cambios ${item.unchangedCases}`;
};

const CollectionsView = () => {
  const [dataVersion, setDataVersion] = useState(0);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncFilter, setSyncFilter] = useState("all");
  const { showAlert, showLoading } = useAppFeedback();

  const metrics = useMemo(() => getCollectionDashboardMetrics(), [dataVersion]);
  const chartsData = useMemo(() => getCollectionChartsData(), [dataVersion]);
  const activeCases = useMemo(() => getCurrentCollectionCases(), [dataVersion]);
  const recoveredCases = useMemo(() => getRecoveredCollectionCases(), [dataVersion]);
  const latestSnapshot = useMemo(() => getLatestImportedSnapshot(), [dataVersion]);
  const pendingSnapshots = useMemo(() => getPendingCollectionSnapshots(), [dataVersion]);
  const importHistory = useMemo(() => getCollectionImportHistory(), [dataVersion]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return activeCases.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.customerName.toLowerCase().includes(normalizedSearch) ||
        item.customerId.toLowerCase().includes(normalizedSearch) ||
        item.policyNumber.toLowerCase().includes(normalizedSearch) ||
        item.installmentCode.toLowerCase().includes(normalizedSearch);

      const matchesSync = syncFilter === "all" || item.syncState === syncFilter;

      return matchesSearch && matchesSync;
    });
  }, [activeCases, searchTerm, syncFilter]);

  const selectedCase = useMemo<CollectionCaseView | null>(() => {
    if (!selectedCaseId) {
      return null;
    }

    return [...activeCases, ...recoveredCases].find((item) => item.id === selectedCaseId) ?? null;
  }, [selectedCaseId, activeCases, recoveredCases]);

  const columns = useMemo(() => getCollectionsColumns(setSelectedCaseId), []);

  const handleImportNextSnapshot = async () => {
    const nextSnapshot = pendingSnapshots[0];

    if (!nextSnapshot) {
      await showAlert({
        icon: "info",
        title: "No hay más archivos mock pendientes",
      });
      return;
    }

    const closeLoading = showLoading({
      title: "Importando Excel mock",
      text: nextSnapshot.sourceFileName,
    });

    try {
      await wait(MIN_ACTION_DELAY_MS);
      const result = applyMockCollectionSnapshot(nextSnapshot.id);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo procesar el archivo",
          text: result.error,
        });
        return;
      }

      await showAlert({
        icon: "success",
        title: `Excel ${result.snapshot.label} importado`,
        text: formatSummary(result.summary),
      });
      setDataVersion((current) => current + 1);
    } finally {
      closeLoading();
    }
  };

  const handleRecordFollowUp = async (payload: {
    caseId: string;
    channel: "call" | "whatsapp" | "email";
    outcome: "contacted" | "promise_to_pay" | "no_answer" | "escalated";
    note: string;
    nextActionDate: string;
  }) => {
    const result = recordCollectionFollowUp({
      ...payload,
      agent: "Equipo Cobranza",
    });

    if (!result.ok) {
      await showAlert({
        icon: "error",
        title: "No se pudo guardar la gestión",
        text: result.error,
      });
      return;
    }

    await showAlert({
      icon: "success",
      title: "Gestión registrada",
    });
    setDataVersion((current) => current + 1);
  };

  return (
    <PageLayout
      header={
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Cobranza
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Importación de morosos, seguimiento operativo y métricas del equipo.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.7, display: "block" }}>
              {latestSnapshot
                ? `Último corte: ${latestSnapshot.label} (${latestSnapshot.sourceFileName})`
                : "Aún no hay corte importado."}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<UploadFileOutlinedIcon />}
              onClick={handleImportNextSnapshot}
            >
              {pendingSnapshots.length > 0
                ? `Importar siguiente Excel (${pendingSnapshots.length} pendientes)`
                : "Importar siguiente Excel"}
            </Button>
          </Stack>
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
                xl: "repeat(4, minmax(0, 1fr))",
              },
            }}
          >
            {metrics.map((item) => (
              <DashboardMetricCard key={item.title} item={item} />
            ))}
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 3fr) minmax(0, 2fr)" },
            }}
          >
            <CollectionsStatusChartsCard
              barData={chartsData.barData}
              pieData={chartsData.pieData}
            />

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Importaciones recientes
              </Typography>

              <Stack spacing={1.1}>
                {importHistory.slice(0, 3).map((item) => (
                  <Paper key={item.snapshotId} variant="outlined" sx={{ p: 1.3 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.sourceFileName} · {item.importedAt}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formatSummary(item.summary)}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>

          <Box sx={{ mt: 2 }}>
            <CollectionsTable
              rows={filteredRows}
              columns={columns}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              syncOptions={syncOptions}
              selectedSyncOption={syncOptions.find((item) => item.value === syncFilter) ?? syncOptions[0]}
              onSyncChange={setSyncFilter}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 2fr) minmax(0, 3fr)" },
            }}
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Clientes recuperados
              </Typography>
              <Stack spacing={1.1}>
                {recoveredCases.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Aún no hay recuperados en el demo.
                  </Typography>
                ) : (
                  recoveredCases.slice(0, 5).map((item) => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 1.3 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {item.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.policyNumber} · recuperado {item.recoveredAt}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Saldo resuelto: {item.currency} {item.amountDue.toFixed(2)}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                Resumen por corte
              </Typography>
              <Stack spacing={1.1}>
                {importHistory.map((item) => (
                  <Paper key={item.snapshotId} variant="outlined" sx={{ p: 1.3 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.sourceFileName} · {item.importedAt}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">{formatSummary(item.summary)}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>

          <CollectionCaseDrawer
            selectedCase={selectedCase}
            onClose={() => setSelectedCaseId(null)}
            onRecordFollowUp={(payload) => {
              void handleRecordFollowUp(payload);
            }}
          />
        </Box>
      }
    />
  );
};

export default CollectionsView;
