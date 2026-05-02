import { Box, Typography } from "@mui/material";
import {
  ChevronRightIcon,
  ExpandMoreIcon,
  FolderOutlined,
} from "../../data/icons";

export const FolderItem = ({
  label,
  open,
  onClick,
  isFile = false,
}: {
  label: string;
  open?: boolean;
  onClick?: () => void;
  isFile?: boolean;
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: onClick ? "pointer" : "default",
        py: 0.5,
      }}
    >
      {/* Flecha solo si es carpeta */}
      {!isFile &&
        (open ? (
          <ExpandMoreIcon fontSize="medium" />
        ) : (
          <ChevronRightIcon fontSize="medium" />
        ))}

      <FolderOutlined sx={{ color: "info.main" }} fontSize="medium" />

      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};
