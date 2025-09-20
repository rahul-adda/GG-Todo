"use client";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  SwipeableDrawer,
  Box,
} from "@mui/material";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Logo from "../common/Logo";
import { useRouter, usePathname } from "next/navigation";
import { SidebarItem } from "@/types/sidebar";
import { resolveIcon } from "@/lib/icons";


interface SidebarProps {
  open: boolean;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  items: SidebarItem[];
  isMobile: boolean;
  drawerWidth: number,
}

export default function Sidebar({
  open,
  mobileOpen,
  handleDrawerToggle,
  items,
  isMobile,
  drawerWidth,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          height: 80,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo color="white" />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {!isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              color="inherit"
              sx={{
                width: 26,
                height: 26,
                p: 0,
                borderRadius: '50%',
                backgroundColor: '#444B55',
                '&:hover': {
                  backgroundColor: '#4A515B',
                },
              }}
            >
              <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
      <List sx={{ px: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {items?.map((item) => {
          const isActive = item.url ? pathname === item.url : false;
          const Icon = item.icon ? resolveIcon(item.icon, isActive) : null;
          return (
            <ListItemButton
              key={item._id}
              onClick={() => {
                if (!isActive && item.url) router.push(item.url);
              }}
              sx={{
                pl: open ? 2 : 1,
                justifyContent: open ? "flex-start" : "center",
                backgroundColor: isActive ? "#383E47" : "transparent",
                color: isActive ? "#5CC994" : "#B8BDC5",
                '&:hover': {
                  backgroundColor: isActive ? "#383E47" : "rgba(255,255,255,0.06)",
                },
                width: '100%',
                maxWidth: 230,
                height: 56,
                px: '20px',
                borderRadius: '8px',
                opacity: 1,
                transform: 'rotate(0deg)',
                mx: open ? 1 : 0,
              }}
            >
              {Icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: isActive ? "##CC994" : "#657081",
                  }}
                >
                  <Icon />
                </ListItemIcon>
              )}
              {open && <ListItemText primary={item.title} sx={{ '& .MuiListItemText-primary': { color: 'inherit' } }} />}
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return isMobile ? (
    <SwipeableDrawer
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle} // required
      onOpen={handleDrawerToggle}  // required for SwipeableDrawer
      disableBackdropTransition={false} // optional for smoother swipe
      disableDiscovery={false}         // optional
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#21252B",
          color: "#fff",
          transition: (theme) => theme.transitions.create('transform', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        "& .MuiListItemIcon-root": {
          color: "inherit",
        },
      }}
    >
      {drawerContent}
    </SwipeableDrawer>
  ) : (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 0,
          transition: (theme) => theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
          backgroundColor: "#21252B",
          color: "#fff",
        },
        "& .MuiListItemIcon-root": {
          color: "inherit",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
