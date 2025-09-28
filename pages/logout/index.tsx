import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

export default function LogoutPage() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth, isInitialized, logout } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      logout();
      router.push("/login");
    }
  }, [isInitialized, isAuthenticated, logout, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Icon icon="eos-icons:loading" className="animate-spin text-4xl" />
    </div>
  );
}
