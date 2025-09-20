import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: "#0CAF60",
        contrastText: "#ffffff",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff",
            color: "#333",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#0CAF60",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0CAF60",
            },
          },
          input: {
            color: "#333",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#fff",
          },
        },
      },
    },
  })