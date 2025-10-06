import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLoadingStore } from "@/lib/useLoadingStore";

interface ProtectedRouteProps {
  allowedRoles: number[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();
  const [accessChecked, setAccessChecked] = useState(false);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    if (!accessChecked) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [accessChecked, setLoading]);

  useEffect(() => {
    if (!isInitialized) return;

    // console.log("ProtectedRoute: State update", {
    //   isInitialized,
    //   isAuthenticated,
    //   user: user?.role_id,
    //   allowedRoles,
    // });

    if (!isAuthenticated) {
      // console.log("ProtectedRoute: Not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }

    if (user && !allowedRoles.includes(user.role_id)) {
      console.log(
        `ProtectedRoute: Role ${user.role_id} not in ${allowedRoles}, redirecting to 403`
      );
      router.replace("/403");
      return;
    }

    // console.log("ProtectedRoute: Access granted");
    setAccessChecked(true);
  }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

  if (!accessChecked) {
    return null;
  }

  return <>{children}</>;
}
