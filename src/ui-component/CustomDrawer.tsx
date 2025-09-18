"use client";

import {
  Drawer as MuiDrawer,
  Box,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import { TfiClose } from "react-icons/tfi";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function CustomDrawer({
  open,
  onClose,
  title,
  children,
}: CustomDrawerProps) {
  return (
    <MuiDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        sx: {
          zIndex: (theme) => theme.zIndex.modal + 20,
        },
      }}
      PaperProps={{
        sx: {
          width: "35dvw",
          maxWidth: "503px",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <TfiClose fontSize={'large'} />
        </IconButton>
      </Box>
      {/* Drawer Content */}
      <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>{children}</Box>
    </MuiDrawer>
  );
}
