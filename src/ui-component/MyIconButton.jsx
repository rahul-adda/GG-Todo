"use client";
import { Badge, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export default function MyIconButton({
  tooltip,
  color = "primary",
  sx,
  loading = false,
  show = false,
  disabled = false,
  children,
  ...props
}) {
  const colorFun = (theme, color) => {
    switch (color) {
      // case "primary":
      //   return `${theme.palette.primary.main}20`;
      // case "error":
      //   return `${theme.palette.error.main}20`;
      // case "orange":
      //   return `${theme.palette.orange.main}30`;
      // case "disabled":
      //   return `${theme.palette.grey?.["300"]}`;
    }
  };

  return (
    <Tooltip title={tooltip} arrow>
      <Box
        sx={(theme) => ({
          borderRadius: "50%",
          backgroundColor: colorFun(
            theme,
            disabled || loading ? "disabled" : color
          ),
          ...sx,
        })}
        {...props}
      >
        <Badge
          color={show ? "primary" : "default"}
          variant="dot"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          invisible={!show}
        >
          <IconButton
            size="small"
            disabled={disabled || loading}
            color={disabled || loading ? "disabled" : color}
          >
            {loading ? (
              <CircularProgress size={19} sx={{ color: `${color}.main` }} />
            ) : (
              children
            )}
          </IconButton>
        </Badge>
      </Box>
    </Tooltip>
  );
}
