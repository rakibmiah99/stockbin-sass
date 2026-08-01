"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password, remember);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xs text-center">
        <h1 className="text-h3 font-semibold text-foreground">Sign in</h1>
        <p className="text-body text-muted">Welcome back — enter your details to continue.</p>
      </div>

      <form className="flex flex-col gap-lg" onSubmit={handleSubmit} noValidate>
        <FormError message={error} />

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

        <FormField id="password" label="Password">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <Checkbox
            id="remember"
            name="remember"
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Link href="/forgot-password" className="text-small font-medium text-primary hover:opacity-80">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-small text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:opacity-80">
          Sign up
        </Link>
      </p>
    </div>
  );
}
