"use client";

import { ReactNode } from "react";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider } from "@mui/material";
import { theme } from "./ThemeProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <QueryProvider>{children}</QueryProvider>
      <Toaster richColors />
    </LocalizationProvider>
    </ThemeProvider>
  );
}
