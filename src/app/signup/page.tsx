"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Logo from "@/components/common/Logo";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useCustomMutation } from "@/lib/QueryHooks";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const { mutation, queryClient, ...rest } = useCustomMutation({
    onSuccess: (data, variables, context) => {
      const { accessToken, ...user } = data;
      localStorage.setItem("user", user);
      Cookies.set("accessToken", accessToken, {
        expires: 7,
        secure: process.env.NEXT_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });
      router.replace("/dashboard");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!name) {
      newErrors.name = "Full Name is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!termsChecked) {
      setTermsError(true);
      return;
    }

    setTermsError(false);
    mutation.mutate({
      method: "POST",
      wantToast: true,
      url: `auth/signup`,
      data: { name, email, password },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      mutation.mutate({
        method: "POST",
        wantToast: true,
        url: `auth/social`,
        headers: { fbToken: token },
      });
    } catch (error) {
      console.error("❌ Google login failed:", error);
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={12} md={6} sx={{ position: "relative" }}>
        <Image
          src="/banner.png"
          alt="Login Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 4, bgcolor: "background.paper" }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Logo color="black" />

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "40px",
              lineHeight: "150%",
              color: "#21252B",
              mt: 2,
            }}
          >
            You’re one click away from less busy work
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle size={24} />}
            sx={{
              mt: "30px",
              width: 480,
              height: 56,
              borderRadius: "12px",
              gap: "16px",
              bgcolor: "#fff",
              color: "#2E2E38",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              borderColor: "#ddd",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "#f7f7f7",
                borderColor: "#ccc",
              },
            }}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>

          <Divider sx={{ my: 3, width: "100%" }}>Or</Divider>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Full Name
              </Typography>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter your full name"
                error={!!errors.name}
                helperText={errors.name}
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
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Email Address
              </Typography>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email}
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
            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                Password
              </Typography>
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? (
                          <IoEyeOutline color="#383E47" />
                        ) : (
                          <IoEyeOffOutline color="#383E47" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mt: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsChecked}
                    onChange={(e) => {
                      setTermsChecked(e.target.checked);
                      if (termsError && e.target.checked) setTermsError(false);
                    }}
                    sx={{
                      color: "#0CAF60",
                      "&.Mui-checked": { color: "#0CAF60" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "14px", color: "#657081" }}>
                    Agree to{" "}
                    <Typography
                      component="a"
                      href="/terms"
                      sx={{ color: "#0CAF60", textDecoration: "none" }}
                    >
                      Terms of Service
                    </Typography>{" "}
                    and{" "}
                    <Typography
                      component="a"
                      href="/privacy"
                      sx={{ color: "#0CAF60", textDecoration: "none" }}
                    >
                      Privacy Policy
                    </Typography>
                  </Typography>
                }
              />
            </Box>
            {termsError && (
              <Typography
                sx={{
                  color: "error.main",
                  fontSize: "13px",
                  ml: 4,
                  float: "left",
                }}
              >
                You must agree before continuing.
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              disabled={mutation.isPending}
              type="submit"
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
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            Existing user?{" "}
            <Typography
              component="a"
              href="/login"
              sx={{ color: "#0CAF60", textDecoration: "none", fontWeight: 500 }}
            >
              Login
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
