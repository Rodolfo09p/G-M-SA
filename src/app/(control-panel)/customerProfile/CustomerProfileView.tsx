"use client";
import { useState } from "react";
import { PageLayout, useAppFeedback } from "@/components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import { MOCK_CUSTOMER } from "./data/clientMock";
import { SearchIcon } from "./data/icons";
import { useFolders } from "./hooks/useFolders";
import { CustomerCard } from "./components/customer/CustomerCard";
import { DocumentsCard } from "./components/documents/DocumentsCard";

const CustomerProfileView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState<typeof MOCK_CUSTOMER | null>(null);
  const { showLoading, showAlert } = useAppFeedback();

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      await showAlert({
        icon: "warning",
        title: "Ingresa una identificación para buscar.",
      });
      return;
    }

    const closeLoading = showLoading({
      title: "Buscando cliente",
      text: "Por favor, espere...",
    });

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 900);
      });

      setCustomer(MOCK_CUSTOMER);

      await showAlert({
        icon: "success",
        title: "Cliente cargado correctamente.",
      });
    } catch {
      await showAlert({
        icon: "error",
        title: "No se pudo completar la búsqueda.",
      });
    } finally {
      closeLoading();
    }
  };

  const { openSections, toggle, toggleNested } = useFolders();

  return (
    <PageLayout
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            Expediente Digital de Cliente
          </Typography>
        </Box>
      }
      content={
        <Box sx={{ p: 3, width: "80%", mx: "auto" }}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                placeholder="Buscar por identificación (sin guiones)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                size="medium"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Buscar
              </Button>
            </CardContent>
          </Card>

          {customer && (
            <Stack spacing={3}>
              <CustomerCard customer={customer} />

              <DocumentsCard
                customer={customer}
                openSections={openSections}
                toggle={toggle}
                toggleNested={toggleNested}
              />
            </Stack>
          )}
        </Box>
      }
    />
  );
};

export default CustomerProfileView;
