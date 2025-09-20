"use client";

import { useEffect, useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarItem } from "@/types/sidebar";
import { filterSidebarByRole } from "@/utils/roleAccess";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { styled } from '@mui/material/styles';
import { usePathname } from "next/navigation";

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing('32px'),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));


export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const handleDrawerToggle = () => setOpen(!open);

  const { data: sidebarItems = [] } = useQuery({
    queryKey: ["sidebar"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sidebar-items");
      return data;
    },
  });

  const roleBasedItems: SidebarItem[] = filterSidebarByRole(
    sidebarItems,
    user?.role ?? 0
  );

  useEffect(() => {
    if (isLoading) return;
    setOpen(user?.role === 1);
  }, [isLoading, user]);


  const pathname = usePathname();

  const noLayoutRoutes = ["/login", "/signup"];
  const hideLayout = pathname !== null && noLayoutRoutes.includes(pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: "flex",  }}>
      <CssBaseline />
      <Header
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        userRole={user?.role}
      />
      <Sidebar
        open={open}
        mobileOpen={open}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        items={roleBasedItems}
        drawerWidth={drawerWidth}
      />
      <Main open={open}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            transition: theme.transitions.create(["margin"], {
              easing: open && !isMobile
                ? theme.transitions.easing.easeOut
                : theme.transitions.easing.sharp,
              duration: open && !isMobile
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Main>

    </Box>
  );
}
