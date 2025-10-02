import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ROLES } from "@/constants/roles";

interface User {
  id: number;
  nric: string;
  email: string;
  username: string | null;
  fullname: string;
  role: string;
  role_id: number;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: {
    nric: string;
    password: string;
  }) => Promise<LoginResult>;
  logout: () => void;
  initializeAuth: () => void;
  getDashboardRoute: () => string;
}

interface JWTToken {
  userId: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (credentials: {
        nric: string;
        password: string;
      }): Promise<LoginResult> => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.error || "Login failed" };
          }

          // Store token in cookie
          Cookies.set("token", data.token, { 
            expires: 7, 
            secure: process.env.NODE_ENV === "production" 
          });

          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isInitialized: true,
          });

          return { success: true, user: data.user };
        } catch (error) {
          console.error("Login error:", error);
          return { success: false, error: "Network error" };
        }
      },

      logout: async () => {
        const { token } = get();

        try {
          if (token) {
            await fetch("/api/auth/logout", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
        } catch (error) {
          console.error("Logout API error:", error);
        }

        // Clear cookie
        Cookies.remove("token");

        // Reset store - NO REDIRECTION HERE
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        });
        
        // The component will handle the redirect via useEffect
      },

      initializeAuth: async () => {
        const token = Cookies.get("token");

        if (token) {
          try {
            // Verify token is not expired
            const decoded = jwtDecode<JWTToken>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
              // Token expired - clear auth state but don't redirect
              Cookies.remove("token");
              set({
                token: null,
                user: null,
                isAuthenticated: false,
                isInitialized: true,
              });
              return;
            }

            // Verify token with backend
            const res = await fetch("/api/auth/verify", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const userData = await res.json();
              set({
                token,
                user: userData,
                isAuthenticated: true,
                isInitialized: true,
              });
            } else {
              // Token invalid - clear auth state but don't redirect
              Cookies.remove("token");
              set({
                token: null,
                user: null,
                isAuthenticated: false,
                isInitialized: true,
              });
            }
          } catch (error) {
            console.error("Auth initialization error:", error);
            // Clear invalid token but don't redirect
            Cookies.remove("token");
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } else {
          set({ isInitialized: true });
        }
      },

      getDashboardRoute: (): string => {
        const { user } = get();
        if (!user) return "/login";
        switch (user.role_id) {
          case ROLES.ADMIN:
            return "/admin/dashboard";
          case ROLES.AHLI:
            return "/ahli/dashboard";
          // case ROLES.AGENT:
          //   return "/agent/dashboard";
          default:
            return "/";
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);