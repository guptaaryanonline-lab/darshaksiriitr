export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-navy" />
        <p className="text-sm font-medium text-slate-500">Loading…</p>
      </div>
    </main>
  );
}
