import { Box, CircularProgress, Switch, SwitchProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 34,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(14px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "rgba(12, 175, 96, 1)",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 10,
    backgroundColor: "rgba(144, 144, 144, 1)",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));


interface MySwitchProps extends SwitchProps {
  loading?: boolean;
  tooltip?: string;
}
export default function MySwitch({ loading, tooltip, ...rest }: MySwitchProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {loading ? <CircularProgress size={20} /> : <CustomSwitch size="small" {...rest as any} />}
    </Box>
  );
}
