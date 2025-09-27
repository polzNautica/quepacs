import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ToastProvider } from "@heroui/react";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) =>
          console.error("Service Worker registration failed", err)
        );
    }
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider locale="es-ES" navigate={router.push}>
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
