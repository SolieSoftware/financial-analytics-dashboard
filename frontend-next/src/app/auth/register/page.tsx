"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { PersonAdd as RegisterIcon } from "@mui/icons-material";
import { createClient } from "@/utils/supabase/browserClient";
import { endpoints } from "@/utils/endpoints";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/market-overview`,
        },
      });

      if (error) throw error;

      const profileResponse = await fetch(endpoints.createProfile, {
        method: "POST",
        body: JSON.stringify({
          email: email, 
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to create profile");
      }
      // Show success message or redirect
      router.push(
        "/auth/login?message=Check your email to confirm your account"
      );
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <RegisterIcon sx={{ fontSize: 48, color: "#667eea", mb: 1 }} />
        <Typography
          variant="h4"
          sx={{ color: "#f7fafc", fontWeight: 600, mb: 1 }}
        >
          Create Account
        </Typography>
        <Typography variant="body2" sx={{ color: "#a0aec0" }}>
          Join your financial analytics dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="first-name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            sx: {
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
              "& fieldset": { 
                borderColor: "rgba(74, 85, 104, 0.3)", 
              },
              "&:hover fieldset": { 
                borderColor: "#667eea",
               },
              "&.Mui-focused fieldset": { 
                borderColor: "#667eea",
              },
            },
          }
        }}
      />

      <TextField
        fullWidth
        label="last-name"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        sx={{ mb: 2 }}
        slotProps={{
            input: {
              sx: { 
                color: "black",
                backgroundColor: "white",
                borderRadius: "10px",
                "& fieldset": { borderColor: "rgba(74, 85, 104, 0.3)" },
                "&:hover fieldset": { borderColor: "#667eea" },
                "&.Mui-focused fieldset": { borderColor: "#667eea" },
              },
            },
            }
          }
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            sx: {
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
              "& fieldset": { borderColor: "rgba(74, 85, 104, 0.3)" },
              "&:hover fieldset": { borderColor: "#667eea" },
              "&.Mui-focused fieldset": { borderColor: "#667eea" },
            },
            }
          }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            sx: {
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
              "& fieldset": { borderColor: "rgba(74, 85, 104, 0.3)" },
              "&:hover fieldset": { borderColor: "#667eea" },
              "&.Mui-focused fieldset": { borderColor: "#667eea" },
            },
            }
          }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            sx: {
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
              "& fieldset": { borderColor: "rgba(74, 85, 104, 0.3)" },
              "&:hover fieldset": { borderColor: "#667eea" },
              "&.Mui-focused fieldset": { borderColor: "#667eea" },
            },
            }
          }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: "#667eea",
          color: "#ffffff",
          py: 1.5,
          mb: 2,
          fontSize: "1rem",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#5a67d8",
          },
          "&:disabled": {
            backgroundColor: "rgba(102, 126, 234, 0.3)",
            }
          }}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#a0aec0" }}>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
