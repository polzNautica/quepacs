import { Head } from "./head";
import { Navbar } from "@/components/navbar";
import { Divider } from "@heroui/react";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { ROLES } from "@/constants/roles";
import DynamicBreadcrumbs from "@/components/breadcrumbs";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="relative flex flex-col h-screen">
        <Head />
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4">
          <DynamicBreadcrumbs role="admin" />
          {children}
        </main>
        <Divider className="mt-10" />
        <footer className="w-full flex items-center justify-center py-3">
          <p className="text-xs text-gray-500 text-center">
            © 2024-2025 Powered by FK Technology Sdn Bhd (929210-W). All Rights
            Reserved.
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
