import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastProvider } from "@heroui/react";
import Background from "@/components/background";
import PageSpinner from "@/components/page-spinner";
import { useLoadingStore } from "@/lib/useLoadingStore";
import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";
import { useAuthStore } from "@/stores/auth-store";
import NProgressBar from '@/components/NProgress';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const setLoading = useLoadingStore((state) => state.setLoading);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { type: "module" })
        .then(() => console.log("Service Worker registered"))
        .catch((err) =>
          console.error("Service Worker registration failed", err)
        );
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    setLoading(true);
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      const handleLoad = () => setLoading(false);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [setLoading]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider navigate={router.push}>
        <NProgressBar />
        <Background />
        <PageSpinner />
        <div className="fixed inset-x-0 top-0 z-[100] flex justify-center">
          <ToastProvider placement="top-center" toastOffset={60} />
        </div>
        <Component {...pageProps} />
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
