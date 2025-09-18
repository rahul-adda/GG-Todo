import React, { useState } from "react";
import { Box, Tooltip, Typography, IconButton } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import toastHandler from "Functions/Toasthandler";
import { dateConverter } from "utils/AsyncUtils";

const Typo = React.memo(({ children, sx = {}, type = "string", ...props }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHover, setHover] = useState(false);
  const toast = toastHandler();

  let typeOf = typeof children,
    text = children;

  if (typeOf === "string" || typeOf === "number" || typeOf === "boolean") {
    if (type === "date") {
      text = children ? dateConverter(children) : "NA";
    } else if (type === "number") {
      text = children || "0";
    } else if (typeOf == "boolean" || type === "boolean") {
      text = children.toString();
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Tooltip arrow title={showTooltip ? text : ""}>
        <Typography
          noWrap
          onMouseEnter={(e) => {
            setShowTooltip(
              children && e.target?.offsetWidth < e.target?.scrollWidth
            );
          }}
          sx={{
            textTransform: "capitalize",
            color: "#4a4a4a",
            fontFamily: "Public Sans",
            fontSize: "0.8rem",
            fontWeight: 450,
            textAlign: "left",
            cursor: "pointer",
            ...sx,
          }}
          {...props}
        >
          {text || "NA"}
        </Typography>
      </Tooltip>

      <IconButton
        sx={{
          visibility: props?.enableCopying && isHover ? "visible" : "hidden",
        }}
        size="small"
        onClick={(e) => {
          if (children) {
            e.preventDefault();
            navigator?.clipboard?.writeText(children);
            toast("sus", "Copied!", { duration: 800 });
          }
        }}
      >
        <ContentCopyRoundedIcon sx={{ fontSize: "0.8rem" }} />
      </IconButton>
    </Box>
  );
});

export default Typo;
