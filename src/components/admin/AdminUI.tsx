export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline px-6 py-6 md:px-10">
      <div>
        <h1 className="font-display text-2xl text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-hairline bg-white/60 p-5 ${className}`}
    >
      {children}
    </div>
  );
}
