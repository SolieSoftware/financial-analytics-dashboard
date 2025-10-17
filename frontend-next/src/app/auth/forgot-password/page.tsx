"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/browserClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      setEmail("");
    } catch (error: any) {
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="auth-icon-container">
          <KeyRound className="auth-icon" />
        </div>
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email to receive a password reset link
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <div className="auth-success-alert">
          <CheckCircle className="h-4 w-4" />
          <span>
            Password reset link sent! Check your email for instructions.
          </span>
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="email" className="auth-label">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="auth-input"
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 auth-link-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
