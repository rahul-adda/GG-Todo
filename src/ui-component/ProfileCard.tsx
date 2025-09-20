"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Skeleton,
  Divider,
  Grid,
  ListItemIcon,
} from "@mui/material";
import { TbPencil } from "react-icons/tb";
import { useAuth } from "@/hooks/useAuth"; // custom hook
import { IoIosLogOut } from "react-icons/io";
import { useCustomMutation } from "@/lib/QueryHooks";

function ProfileCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        borderWidth: "1px",
        borderColor: "rgba(233, 234, 236, 1)",
        backgroundColor: "rgba(253, 253, 253, 1)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      variant="outlined"
    >
      {/* Avatar + Role + Joined Date */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="circular" width={60} height={60} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="text" width={160} />
        </Box>
      </Box>

      {/* Name field */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: "16px" }} />
      </Box>

      {/* Email field */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="rounded" height={56} sx={{ borderRadius: "12px" }} />
      </Box>

      {/* Button */}
      <Skeleton
        variant="rounded"
        height={56}
        width="100%"
        sx={{ borderRadius: "12px", mt: 3 }}
      />
    </Card>
  );
}

const statsData = [
  { label: "All Todos", value: 12 },
  { label: "Upcoming", value: 4 },
  { label: "Completed", value: 6 },
];

interface ProfileCardProps {
  setOpen: (open: boolean) => void;
  handleLogout?: () => void;
}

export default function ProfileCard({
  setOpen,
  handleLogout,
}: ProfileCardProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/avatar.png");
  const [loading, setLoading] = useState(true);

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: (data, variables, context) => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user_list"],
      });
    },
  });

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatar(user.avatar || "/avatar.png");
      setLoading(false);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
  };

  const handleUpdate = async () => {
    try {
      mutation.mutate({
        method: "PUT",
        wantToast: true,
        url: `user/profile`,
        data: {
          name,
        },
      });
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  if (loading) return <ProfileCardSkeleton />;

  return (
    <>
      <Card
        sx={{
          borderRadius: "16px",
          borderWidth: "1px",
          borderColor: "rgba(233, 234, 236, 1)",
          backgroundColor: "rgba(253, 253, 253, 1)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
        variant="outlined"
      >
        {/* Avatar + Role + Joined Date */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              alt="User Avatar"
              src={avatar}
              sx={{ width: 60, height: 60 }}
            />
            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  top: 0,
                  p: 0,
                  right: 0,
                  width: 20,
                  height: 20,
                  backgroundColor: "rgba(244, 239, 255, 1)", // bg color
                  border: "1px solid #ddd",
                  "&:hover": {
                    backgroundColor: "rgba(233, 227, 250, 1)", // slightly darker hover
                  },
                }}
              >
                <TbPencil
                  size={14}
                  style={{ color: "rgba(140, 98, 255, 1)" }}
                />
              </IconButton>
            </label>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255, 208, 35, 0.2)",
                color: "rgba(228, 180, 1, 1)",
                fontWeight: 400,
                fontSize: "10px",
                letterSpacing: "0.5%",
                px: 2,
                py: 0.5,
                borderRadius: "20px",
              }}
            >
              {user?.role === 1 ? "Super Admin" : "User"}
            </Box>

            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              Joined On :{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : "16/08/2023 18:00"}
            </Typography>
          </Box>
        </Box>

        {/* Name field */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, color: "text.primary" }}
          >
            Full Name
          </Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Enter your full name"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#0CAF60",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: "2px",
                },
              },
            }}
          />
        </Box>

        {/* Email field */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, color: "text.primary" }}
          >
            Email Address
          </Typography>
          <TextField
            value={email}
            disabled
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "#ddd",
                },
                "&:hover fieldset": {
                  borderColor: "#0CAF60",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0CAF60",
                  borderWidth: "2px",
                },
              },
            }}
          />
        </Box>

        {/* Update button */}
        <Button
          variant="contained"
          fullWidth
          disabled={mutation.isPending}
          onClick={handleUpdate}
          sx={{
            mt: 2,
            height: "50px",
            borderRadius: "12px",
            px: "16px",
            backgroundColor: "#0CAF60",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#099950",
              boxShadow: "none",
            },
          }}
        >
          {mutation.isPending ? "Updating..." : "Update Profile"}
        </Button>

        <Divider sx={{ my: 1.5 }} />
        <Grid container>
          {statsData.map((stat, index) => (
            <Grid
              item
              xs={4}
              key={stat.label}
              pl={2}
              sx={{
                textAlign: "start",
                borderRight:
                  index !== statsData.length - 1
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "none",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "rgba(16, 24, 40, 0.6)",
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "32px",
                  color: "rgba(16, 24, 40, 1)",
                }}
              >
                {stat.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          onClick={handleLogout}
          sx={{
            color: "rgba(33, 37, 43, 1)",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "150%",
            letterSpacing: "0.5%",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              marginRight: "8px",
              color: "rgba(152, 159, 171, 1)",
              "& svg": {
                fontSize: 18,
                width: 18,
                height: 18,
                color: "rgba(152, 159, 171, 1)",
              },
            }}
          >
            <IoIosLogOut />
          </ListItemIcon>
          Logout
        </Button>
      </Box>
    </>
  );
}
