import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          extend: "dark",
          colors: {
            background: "#f5f5f5",
            foreground: "#000000",
            primary: {
              50: "#f1f6fc", // very light blue
              100: "#e2ecf9",
              200: "#c0d7f2",
              300: "#9ac0ea",
              400: "#5f9ee0",
              500: "#3366cc", // Admiral Blue (default)
              600: "#2e5ab8",
              700: "#264b99",
              800: "#1f3b7a",
              900: "#182d5c",
              DEFAULT: "#3366cc",
              foreground: "#ffffff",
            },
            focus: "#2e5ab8",
          },
        },
        dark: {
          extend: "light",
          colors: {
            background: "#000000",
            foreground: "#ffffff",
            primary: {
              50: "#f1f6fc", // very light blue
              100: "#e2ecf9",
              200: "#c0d7f2",
              300: "#9ac0ea",
              400: "#5f9ee0",
              500: "#3366cc", // Admiral Blue (default)
              600: "#2e5ab8",
              700: "#264b99",
              800: "#1f3b7a",
              900: "#182d5c",
              DEFAULT: "#3366ccff",
              foreground: "#ffffff",
            },
            focus: "#2e5ab8",
          },
        },
      },
    }),
  ],
};