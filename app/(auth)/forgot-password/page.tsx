"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

type Step = "email" | "otp" | "reset";

const STEP_COPY: Record<Step, { title: string; description: string }> = {
  email: {
    title: "Forgot password?",
    description:
      "Enter the email associated with your account and we'll send you a verification code.",
  },
  otp: {
    title: "Check your email",
    description: "Enter the 4-digit verification code we sent you.",
  },
  reset: {
    title: "Set a new password",
    description: "Choose a new password for your account.",
  },
};

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await authApi.verifyOtp(email, otp);
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code is invalid or expired.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await authApi.resetPassword(email, otp, password, confirmPassword);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const { title, description } = STEP_COPY[step];

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xs text-center">
        <h1 className="text-h3 font-semibold text-foreground">{title}</h1>
        <p className="text-body text-muted">{description}</p>
      </div>

      <FormError message={error} />

      {step === "email" && (
        <form className="flex flex-col gap-lg" onSubmit={handleEmailSubmit} noValidate>
          <FormField id="email" label="Email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Sending…" : "Continue"}
          </Button>
        </form>
      )}

      {step === "otp" && (
        <form className="flex flex-col gap-lg" onSubmit={handleOtpSubmit} noValidate>
          <FormField id="otp" label="Verification code">
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              required
              placeholder="0000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </FormField>
          <Button type="submit" fullWidth disabled={submitting || otp.length !== 4}>
            {submitting ? "Verifying…" : "Verify code"}
          </Button>
        </form>
      )}

      {step === "reset" && (
        <form className="flex flex-col gap-lg" onSubmit={handleResetSubmit} noValidate>
          <FormField id="password" label="New password">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Create a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <FormField id="confirmPassword" label="Confirm new password">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormField>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Resetting…" : "Reset password"}
          </Button>
        </form>
      )}

      <p className="text-center text-small text-muted">
        <Link href="/login" className="font-medium text-primary hover:opacity-80">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
