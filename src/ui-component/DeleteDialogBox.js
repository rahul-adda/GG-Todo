import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Box ,Button,Dialog,DialogActions ,DialogContent,DialogContentText,DialogTitle} from "@mui/material";
import MyButton from "./MyButton";

export default function DeleteDialogBox(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));


  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
            },
          },
        }}
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ fontSize: "24px" }} id="responsive-dialog-title">
          {"Delete"}
        </DialogTitle>
        <DialogContent
          sx={{
            height: "16%",
            borderRadius: "10px",
            backgroundColor: "FFFFFF",
          }}
        >
          <DialogContentText
            sx={{
              color: "#343434",
              fontFamily: "Public Sans",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Are you sure you want to delete this record? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Box sx={{ display: 'flex', marginTop: '20px',justifyContent:'flex-end', gap:2}}>
          <MyButton variant="outlined" color="inherit" onClick={props.handleClose}>Cancel </MyButton>
          <MyButton 
          color="error"
          onClick={()=>{
            props?.delete();
            props?.handleClose();
          }}
          > 
          Confirm 
          </MyButton>

          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
