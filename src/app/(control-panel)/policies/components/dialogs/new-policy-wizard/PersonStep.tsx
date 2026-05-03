import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import type { PersonaType } from "../../../data/dataConfig";
import { PERSON_CARDS } from "../../../constants/newPolicyWizardConfig";

type Props = {
  onSelectPerson: (type: PersonaType) => void;
};

export const PersonStep = ({ onSelectPerson }: Props) => {
  return (
    <Grid container spacing={2}>
      {PERSON_CARDS.map((option) => {
        const Icon = option.icon;

        return (
          <Grid size={{ xs: 12, md: 6 }} key={option.value}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 2,
                textAlign: "center",
                borderColor: "divider",
                boxShadow: 0,
                transition: "all .2s",
              }}
            >
              <CardContent>
                <Box mb={2}>
                  <Icon sx={{ fontSize: 48, color: "info.main" }} />
                </Box>

                <Typography variant="h6" fontWeight={700}>
                  {option.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {option.description}
                </Typography>

                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  sx={{
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "info.main",
                      color: "#fff",
                    },
                  }}
                  onClick={() => onSelectPerson(option.value)}
                >
                  Continuar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
