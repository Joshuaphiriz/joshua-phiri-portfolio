import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
