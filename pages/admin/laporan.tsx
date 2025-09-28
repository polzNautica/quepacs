import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/auth-store";
import AdminLayout from "@/layouts/admin";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function LaporanAdmin() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <AdminLayout>
      <h1>Laporan Admin</h1>
    </AdminLayout>
  );
}
