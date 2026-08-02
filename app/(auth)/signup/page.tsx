import type { Metadata } from "next";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { FormError } from "@/components/ui/FormError";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xs text-center">
        <h1 className="text-h3 font-semibold text-foreground">Create your account</h1>
        <p className="text-body text-muted">Get started with Stockbin in a few seconds.</p>
      </div>

      <form className="flex flex-col gap-lg" action={registerAction}>
        <FormError message={error ?? null} />

        <FormField id="name" label="Name">
          <Input id="name" name="name" type="text" autoComplete="name" required placeholder="Jane Doe" />
        </FormField>

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
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Create a password"
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password">
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Re-enter your password"
          />
        </FormField>

        <Button type="submit" fullWidth>
          Create account
        </Button>
      </form>

      <p className="text-center text-small text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
