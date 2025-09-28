import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/auth-store";
import AdminLayout from "@/layouts/admin";
import { Button } from "@heroui/react";

export default function DashboardAdmin() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <AdminLayout>
      <h1>Dashboard Admin</h1>
      <Button onPress={logout}>Logout</Button>
    </AdminLayout>
  );
}
