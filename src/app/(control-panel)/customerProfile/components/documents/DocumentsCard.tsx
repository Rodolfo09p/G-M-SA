import { Card, Box, Typography } from "@mui/material";
import { FolderSection } from "./FolderSection";
import { FileItem } from "./FileItem";

export const DocumentsCard = ({
  customer,
  openSections,
  toggle,
  toggleNested,
}: {
  customer: any;
  openSections: any;
  toggle: (section: string) => void;
  toggleNested: (section: string, id: string) => void;
}) => {
  return (
    <Card elevation={2}>
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography fontWeight={700}>Documentos</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* CLIENTE */}
        <FolderSection
          label="Cliente"
          open={openSections.cliente}
          onToggle={() => toggle("cliente")}
        >
          {customer.documents.map((doc: string, i: number) => (
            <FileItem key={doc + i} name={doc} />
          ))}
        </FolderSection>

        {/* POLIZAS */}
        <FolderSection
          label="Pólizas"
          open={openSections.polizas}
          onToggle={() => toggle("polizas")}
        >
          {customer.policies.map((policy: any) => (
            <FolderSection
              key={policy.number}
              label={policy.number}
              open={openSections.polizasItems[policy.number]}
              onToggle={() => toggleNested("polizasItems", policy.number)}
            >
              {policy.docs.map((doc: string, i: number) => (
                <FileItem key={doc + i} name={doc} />
              ))}
            </FolderSection>
          ))}
        </FolderSection>

        {/* RECLAMOS */}
        <FolderSection
          label="Reclamos"
          open={openSections.reclamos}
          onToggle={() => toggle("reclamos")}
        >
          {customer.claims.map((claim: any) => (
            <FolderSection
              key={claim.id}
              label={claim.id}
              open={openSections.reclamosItems[claim.id]}
              onToggle={() => toggleNested("reclamosItems", claim.id)}
            >
              {claim.docs.map((doc: string, i: number) => (
                <FileItem key={doc + i} name={doc} />
              ))}
            </FolderSection>
          ))}
        </FolderSection>
      </Box>
    </Card>
  );
};
