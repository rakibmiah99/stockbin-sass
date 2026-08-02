import type { Metadata } from "next";
import Link from "next/link";
import { getResetFlow } from "@/lib/auth/cookies";
import { requestOtpAction, verifyOtpAction, resetPasswordAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Forgot password",
};

const STEP_COPY = {
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
} as const;

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const flow = await getResetFlow();
  const step = flow?.step ?? "email";
  const { title, description } = STEP_COPY[step];

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xs text-center">
        <h1 className="text-h3 font-semibold text-foreground">{title}</h1>
        <p className="text-body text-muted">{description}</p>
      </div>

      <FormError message={error ?? null} />

      {step === "email" && (
        <form className="flex flex-col gap-lg" action={requestOtpAction}>
          <FormField id="email" label="Email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
            />
          </FormField>
          <Button type="submit" fullWidth>
            Continue
          </Button>
        </form>
      )}

      {step === "otp" && flow && (
        <form className="flex flex-col gap-lg" action={verifyOtpAction}>
          <input type="hidden" name="email" value={flow.email} />
          <FormField id="otp" label="Verification code">
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              required
              placeholder="0000"
            />
          </FormField>
          <Button type="submit" fullWidth>
            Verify code
          </Button>
        </form>
      )}

      {step === "reset" && flow && flow.step === "reset" && (
        <form className="flex flex-col gap-lg" action={resetPasswordAction}>
          <input type="hidden" name="email" value={flow.email} />
          <input type="hidden" name="otp" value={flow.otp} />
          <FormField id="password" label="New password">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Create a new password"
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
            />
          </FormField>
          <Button type="submit" fullWidth>
            Reset password
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
