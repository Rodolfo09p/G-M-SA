"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import clsx from "clsx";
import FooterTheme from "@/contexts/FooterTheme";

type FooterLayout1Props = { className?: string };

function FooterLayout1(props: FooterLayout1Props) {
  const { className } = props;
  const currentYear = new Date().getFullYear();

  return (
    <FooterTheme>
      <AppBar
        id="fuse-footer"
        className={clsx("relative z-20 border-t", className)}
        color="default"
        sx={(theme) => ({
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.secondary,
          boxShadow: "none",
        })}
        elevation={0}
      >
        <Toolbar className="flex min-h-12 items-center justify-between px-24 py-0 sm:px-32 md:min-h-16">
          <div className="flex items-center">
            <Typography
              variant="caption"
              className="font-semibold tracking-tight"
            >
              © {currentYear} G&M SEGUROS S.A.
            </Typography>
            <Typography
              variant="caption"
              className="ml-8 hidden sm:inline opacity-50"
            >
              | Todos los derechos reservados.
            </Typography>
          </div>

          <div className="flex items-center gap-16">
            <Typography
              variant="caption"
              className="font-bold uppercase tracking-widest opacity-70"
              sx={{ fontSize: "10px" }}
            >
              Sistema de Gestión de Correduría
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </FooterTheme>
  );
}

export default memo(FooterLayout1);
