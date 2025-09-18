"use client";

import { useState, useEffect } from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch?: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <Paper
      component="form"
      sx={{
        width: 320,
        height: 48,
        display: "flex",
        alignItems: "center",
        padding: "8px 8px 8px 16px",
        gap: "10px",
        borderRadius: "8px",
        bgcolor: "#f1f3f4",
        boxShadow: "none",
        opacity: 1,
        transform: "rotate(0deg)",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: "0" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
