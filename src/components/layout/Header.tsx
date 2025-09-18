"use client";

import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { styled } from "@mui/material/styles";
import Logo from "../common/Logo";
import SearchBar from "../common/SearchBar";
import ProfileMenu from "../common/ProfileMenu";

interface HeaderProps {
  open: boolean;
  drawerWidth: number;
  handleDrawerToggle: () => void;
  isMobile: boolean;
  userRole: number | undefined;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth" && prop !== "isMobile",
})<{
  open?: boolean;
  drawerWidth: number;
  isMobile: boolean;
}>(({ theme, open, drawerWidth, isMobile }) => ({
  backgroundColor: "#fff",
  color: theme.palette.text.primary,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  zIndex: theme.zIndex.drawer + 1,
  height: 80,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open &&
    !isMobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Header({
  open,
  drawerWidth,
  handleDrawerToggle,
  isMobile,
  userRole
}: HeaderProps) {
  return (
    <AppBarStyled
      position="fixed"
      open={open}
      drawerWidth={drawerWidth}
      isMobile={isMobile}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", height: "100%", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!open && (
            <> {userRole === 1 && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
              <Logo color="black" />
            </>
          )}
          <Box sx={{ ml: "20px", width: 320, maxWidth: "40vw" }}>
            <SearchBar />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <IoIosNotificationsOutline style={{ width: 24, height: 24, color: 'rgba(33, 37, 43, 1)' }} />
          </IconButton>
          <ProfileMenu />
        </Box>
      </Toolbar>
    </AppBarStyled>
  );
}
