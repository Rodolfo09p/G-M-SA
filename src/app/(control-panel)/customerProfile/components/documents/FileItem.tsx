import { Box, Typography } from "@mui/material";
import { InsertDriveFileOutlined } from "../../data/icons";

export const FileItem = ({ name }: { name: string }) => {
  return (
    <Box
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
      <Typography variant="caption">{name}</Typography>
    </Box>
  );
};