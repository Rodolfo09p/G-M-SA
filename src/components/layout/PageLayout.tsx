import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";

export const PageLayout = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.vars.palette.divider,
  },
}));
