"use client";

import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  ListItemIcon,
  Divider,
  Backdrop,
} from "@mui/material";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineUser } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CustomDrawer from "../../ui-component/CustomDrawer";
import ProfileCard from "../../ui-component/ProfileCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useCustomMutation } from "@/lib/QueryHooks";

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user } = useAuth();
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);

  const { mutation, queryClient, ...rest } = useCustomMutation({
    onSuccess: (data, variables, context) => {
      router.replace("/login");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    mutation.mutate({
      method: "POST",
      wantToast: true,
      url: `auth/logout`,
    });
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleMenu}
        size="small"
        sx={{
          ml: 2,
          gap: 0.5,
          position: "relative",
          alignItems: "center",
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        <Avatar
          alt={user?.name || "User"}
          src={user?.avatar || ""}
          sx={{ width: 32, height: 32 }}
        />
        <ExpandMoreIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.6)" }} />
      </IconButton>

      {open && (
        <Backdrop
          open={open}
          onClick={handleClose}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            backgroundColor: "rgba(0,0,0,0.1)",
            backdropFilter: "blur(1px)",
          }}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            boxShadow: "none",
            minWidth: 180,
            borderRadius: "16px",
            zIndex: (theme) => theme.zIndex.drawer + 4,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenProfile(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <HiOutlineUser fontSize="large" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider sx={{ my: 0.5, mx: 2 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IoIosLogOut fontSize="large" />
          </ListItemIcon>
           {mutation.isPending ? 'Logging Out' : 'Logout'}
        </MenuItem>
      </Menu>
      <CustomDrawer
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        title="Profile"
      >
        <ProfileCard setOpen={setOpenProfile} handleLogout={handleLogout}/>
      </CustomDrawer>
    </>
  );
}
