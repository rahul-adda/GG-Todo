import { Button, CircularProgress } from "@mui/material";
import { forwardRef } from "react";

const MyButton = forwardRef((props, ref) => {
  const { sx, loading, CircularSize, children, ...rest } = props;

  return (
    <Button
      ref={ref}
      variant="contained"
      disabled={loading || undefined}
      {...rest}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        fontFamily: "Public Sans",
        textTransform: "none",
        // boxShadow: "none",
        ...sx,
      }}
      startIcon={loading ? <CircularProgress size={16} /> : rest?.startIcon}
    >
      {children}
    </Button>
  );
});

export default MyButton;
