"use client";
import { useState } from "react";
import { PageLayout } from "@/components";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

import { MOCK_CUSTOMER } from "./data/clientMock";
import {
  SearchIcon,
  ChevronRightIcon,
  EmailIcon,
  ExpandMoreIcon,
  InsertDriveFileOutlined,
  FolderOutlined,
  PhoneIcon,
} from "./data/icons";
import { useFolders } from "./hooks/useFolders";

const CustomerProfileView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customer, setCustomer] = useState<typeof MOCK_CUSTOMER | null>(null);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") setCustomer(MOCK_CUSTOMER);
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
          {/* Buscador centrado abajo del título */}
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
              {/* CARD DE DATOS DEL CLIENTE */}
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

                  <Stack spacing={1}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, letterSpacing: 0.5 }}
                    >
                      INFORMACIÓN DE CONTACTO
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{customer.email}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      textAlign: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="info.main"
                      >
                        {customer.stats.totalPolicies}
                      </Typography>
                      <Typography variant="caption" color="info.main">
                        Pólizas
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="warning.main"
                      >
                        {customer.stats.totalClaims}
                      </Typography>
                      <Typography variant="caption" color="warning.main">
                        Reclamos
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.main"
                      >
                        {customer.stats.activePolicies}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Activas
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* CARD DE DOCUMENTOS Y CARPETAS */}
              <Card elevation={2}>
                <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                  <Typography fontWeight={700}>Documentos</Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                  {/* CLIENTE */}
                  <Box>
                    <Box
                      onClick={() => toggle("cliente")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        py: 0.5,
                      }}
                    >
                      {openSections.cliente ? (
                        <ExpandMoreIcon fontSize="medium" />
                      ) : (
                        <ChevronRightIcon fontSize="medium" />
                      )}
                      <FolderOutlined
                        sx={{ color: "info.main" }}
                        fontSize="medium"
                      />
                      <Typography>Cliente</Typography>
                    </Box>

                    {openSections.cliente && (
                      <Box sx={{ pl: 4 }}>
                        {customer.documents.map((doc, i) => (
                          <Box
                            key={doc + i}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              py: 0.5,
                            }}
                          >
                            <InsertDriveFileOutlined
                              fontSize="medium"
                              sx={{ color: "info.main" }}
                            />
                            <Typography variant="body2">{doc}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* POLIZAS */}
                  <Box mt={1}>
                    <Box
                      onClick={() => toggle("polizas")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        py: 0.5,
                      }}
                    >
                      {openSections.polizas ? (
                        <ExpandMoreIcon fontSize="medium" />
                      ) : (
                        <ChevronRightIcon fontSize="medium" />
                      )}
                      <FolderOutlined
                        sx={{ color: "info.main" }}
                        fontSize="medium"
                      />
                      <Typography>Pólizas</Typography>
                    </Box>

                    {openSections.polizas && (
                      <Box sx={{ pl: 4 }}>
                        {customer.policies.map((policy, i) => (
                          <Box key={policy.number + i}>
                            <Box
                              onClick={() =>
                                toggleNested("polizasItems", policy.number)
                              }
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                cursor: "pointer",
                                py: 0.5,
                              }}
                            >
                              {openSections.polizasItems[policy.number] ? (
                                <ExpandMoreIcon fontSize="medium" />
                              ) : (
                                <ChevronRightIcon fontSize="medium" />
                              )}
                              <FolderOutlined
                                sx={{ color: "info.main" }}
                                fontSize="medium"
                              />
                              <Typography variant="body2">
                                {policy.number}
                              </Typography>
                            </Box>

                            {openSections.polizasItems[policy.number] && (
                              <Box sx={{ pl: 4 }}>
                                {policy.docs.map((doc, idx) => (
                                  <Box
                                    key={policy.number + doc + idx}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <InsertDriveFileOutlined
                                      fontSize="medium"
                                      sx={{ color: "info.main" }}
                                    />
                                    <Typography variant="caption">
                                      {doc}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* RECLAMOS */}
                  <Box mt={1}>
                    <Box
                      onClick={() => toggle("reclamos")}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        py: 0.5,
                      }}
                    >
                      {openSections.reclamos ? (
                        <ExpandMoreIcon fontSize="medium" />
                      ) : (
                        <ChevronRightIcon fontSize="medium" />
                      )}
                      <FolderOutlined
                        sx={{ color: "info.main" }}
                        fontSize="medium"
                      />
                      <Typography>Reclamos</Typography>
                    </Box>

                    {openSections.reclamos && (
                      <Box sx={{ pl: 4 }}>
                        {customer.claims.map((claim, i) => (
                          <Box key={claim.id + i}>
                            <Box
                              onClick={() =>
                                toggleNested("reclamosItems", claim.id)
                              }
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                cursor: "pointer",
                                py: 0.5,
                              }}
                            >
                              {openSections.reclamosItems[claim.id] ? (
                                <ExpandMoreIcon fontSize="medium" />
                              ) : (
                                <ChevronRightIcon fontSize="medium" />
                              )}
                              <FolderOutlined
                                sx={{ color: "info.main" }}
                                fontSize="medium"
                              />
                              <Typography variant="body2">
                                {claim.id}
                              </Typography>
                            </Box>

                            {openSections.reclamosItems[claim.id] && (
                              <Box sx={{ pl: 4 }}>
                                {claim.docs.map((doc, idx) => (
                                  <Box
                                    key={claim.id + doc + idx}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <InsertDriveFileOutlined
                                      fontSize="medium"
                                      sx={{ color: "info.main" }}
                                    />
                                    <Typography variant="caption">
                                      {doc}
                                    </Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            </Stack>
          )}
        </Box>
      }
    />
  );
};

export default CustomerProfileView;
