import Popover from "@mui/material/Popover";

function MyPopover({ PaperProps, ...props }) {
  return (
    <Popover
      marginThreshold={16}
      elevation={1}
      slotProps={{
        paper: {
          sx: (theme) => ({
            p: 0.5,
            bgcolor: "text.white",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          }),
        },
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      {...props}
    >
      {props.children}
    </Popover>
  );
}

export default MyPopover;
