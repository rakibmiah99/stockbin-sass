import type { Metadata } from "next";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xs text-center">
        <h1 className="text-h3 font-semibold text-foreground">Sign in</h1>
        <p className="text-body text-muted">Welcome back — enter your details to continue.</p>
      </div>

      <form className="flex flex-col gap-lg" action={loginAction}>
        <FormError message={error ?? null} />

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

        <FormField id="password" label="Password">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
          />
        </FormField>

        <div className="flex items-center justify-between">
          <Checkbox id="remember" name="remember" label="Remember me" defaultChecked />
          <Link href="/forgot-password" className="text-small font-medium text-primary hover:opacity-80">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth>
          Sign in
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
