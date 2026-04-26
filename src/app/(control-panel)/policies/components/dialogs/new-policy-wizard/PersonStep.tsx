import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import type { PersonaType } from "../../../data/dataConfig";
import { PERSON_CARDS } from "../../../constants/newPolicyWizardConfig";

type Props = {
  onSelectPerson: (type: PersonaType) => void;
};

export const PersonStep = ({ onSelectPerson }: Props) => {
  return (
    <Grid container spacing={2}>
      {PERSON_CARDS.map((option) => (
        <Grid size={{ xs: 12, md: 6 }} key={option.value}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              transition: "all .2s",
              "&:hover": { boxShadow: 4 },
            }}
          >
            <CardActionArea
              onClick={() => onSelectPerson(option.value)}
              sx={{ p: 1 }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={800}>
                  {option.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {option.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="secondary.main"
                  sx={{ mt: 1.5, display: "block" }}
                >
                  Click para continuar
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
