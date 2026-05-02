import { Box } from "@mui/material";
import { FolderItem } from "./FolderItem";

export const FolderSection = ({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Box>
      <FolderItem label={label} open={open} onClick={onToggle} />

      {open && <Box sx={{ pl: 4 }}>{children}</Box>}
    </Box>
  );
};
