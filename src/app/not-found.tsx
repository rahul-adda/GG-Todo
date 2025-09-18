"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 96, fontWeight: 700, color: "#8C62FF" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ color: "rgba(33, 37, 43, 0.7)", mb: 3 }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        sx={{
          backgroundColor: "#8C62FF",
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          px: 4,
          py: 1.5,
          fontSize: 16,
          boxShadow: "none",
          '&:hover': { backgroundColor: '#6C47D8' },
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
}
