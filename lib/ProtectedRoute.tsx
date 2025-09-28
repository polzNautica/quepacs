import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface ProtectedRouteProps {
  allowedRoles: number[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    console.log("ProtectedRoute: State update", {
      isInitialized,
      isAuthenticated,
      user: user?.role_id,
      allowedRoles
    });

    // If we have user data OR auth is initialized, we can check access
    const canCheckAccess = isInitialized || user;

    if (canCheckAccess) {
      if (!isAuthenticated) {
        console.log("ProtectedRoute: Not authenticated, redirecting to login");
        router.replace("/login");
        return;
      }

      if (user && !allowedRoles.includes(user.role_id)) {
        console.log(`ProtectedRoute: Role ${user.role_id} not in ${allowedRoles}, redirecting to 403`);
        router.replace("/403");
        return;
      }

      // Access granted
      console.log("ProtectedRoute: Access granted");
      setAccessChecked(true);
    }
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  // Show loading while checking access
  if (!accessChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Icon icon="eos-icons:loading" className="animate-spin text-4xl text-primary mb-4" />
        <span className="ml-2">Sebentar...</span>
      </div>
    );
  }

  return <>{children}</>;
}