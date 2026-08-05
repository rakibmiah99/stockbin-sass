export function FormAlert({ children }: { children: string }) {
  return (
    <div className="rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 text-sm px-4 py-2.5">
      {children}
    </div>
  )
}
