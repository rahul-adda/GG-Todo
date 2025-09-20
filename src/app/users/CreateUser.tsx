"use client";

import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Grid,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { TbPencil } from "react-icons/tb";
import { useCustomMutation } from "@/lib/QueryHooks";
import { cleanPayload } from "@/utils/commonTable";

interface CreateUserCardProps {
  setOpen: (open: boolean) => void;
}

export default function CreateUserCard({ setOpen }: CreateUserCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState(2);
  const [password, setPassword] = useState("");

  const { mutation, queryClient } = useCustomMutation({
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user_list"] });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatar(previewUrl);
  };
  
  const rawData = {
    name,
    email,
    role,
    password,
    avatar,
  };
  
  const data = cleanPayload(rawData);
  
  
  const handleCreateUser = () => {
    mutation.mutate({
      method: "POST",
      wantToast: true,
      url: `user/create`,
      data
    });
  };

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
      {/* Avatar Upload */}
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
                backgroundColor: "rgba(244, 239, 255, 1)",
                border: "1px solid #ddd",
                "&:hover": {
                  backgroundColor: "rgba(233, 227, 250, 1)",
                },
              }}
            >
              <TbPencil size={14} style={{ color: "rgba(140, 98, 255, 1)" }} />
            </IconButton>
          </label>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Create New User
        </Typography>
      </Box>

      {/* Name field */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body2">Full Name</Typography>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Enter full name"
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
        <Typography variant="body2">Email Address</Typography>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Enter email"
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

      {/* Password field */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body2">Password</Typography>
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Enter password"
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

      {/* Role field */}
      <FormControl
        fullWidth
        variant="outlined"
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
      >
        <Select
          value={role === undefined || role === null ? "" : String(role)}
          onChange={(e) => {
            const value = e.target.value;
            setRole(Number(value));
          }}
          displayEmpty
          inputProps={{ "aria-label": "Role" }}
          MenuProps={{
            disablePortal: true,
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            Select role
          </MenuItem>
          <MenuItem value="1">Admin</MenuItem>
          <MenuItem value="2">User</MenuItem>
        </Select>
      </FormControl>

      {/* Create button */}
      <Button
        variant="contained"
        fullWidth
        disabled={mutation.isPending}
        onClick={handleCreateUser}
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
        {mutation.isPending ? "Creating..." : "Create User"}
      </Button>
    </Card>
  );
}
