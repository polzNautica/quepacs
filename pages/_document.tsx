import { Html, Head, Main, NextScript } from "next/document";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link href="/manifest.json" rel="manifest" />
      <meta name="theme-color" content="#0f172a" />
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <link rel="icon" href="/icons/favicon.ico" />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
