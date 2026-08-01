export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-danger bg-danger/10 px-base py-sm text-small text-danger"
    >
      {message}
    </div>
  );
}
