"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-base p-xl text-center">
      <h1 className="text-h4 font-semibold text-foreground">Something went wrong</h1>
      <p className="max-w-md text-body text-muted">
        {error.message || "Couldn't load this page. Your session is still active — please try again."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
