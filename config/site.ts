export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "QuepacsKasih",
  description: "QuepacsKasih PWA.",
  
  // Public navigation items (shown when not logged in)
  navItemsPublic: [
    {
      label: "Laman Utama",
      href: "/",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
  ],

  // Admin navigation items
  navItemsAdmin: [
    {
      label: "Dashboard Admin",
      href: "/admin/dashboard",
    },
    {
      label: "Pengurusan Pengguna",
      href: "/admin/users",
    },
    {
      label: "Laporan",
      href: "/admin/reports",
    },
    {
      label: "Profil",
      href: "/profile",
    },
    {
      label: "Log Keluar",
      href: "/logout",
    },
  ],

  // Ahli navigation items
  navItemsAhli: [
    {
      label: "Dashboard Ahli",
      href: "/ahli/dashboard",
    },
    {
      label: "Profil Saya",
      href: "/ahli/profile",
    },
    {
      label: "Aktiviti",
      href: "/ahli/activities",
    },
    {
      label: "Bantuan",
      href: "/ahli/help",
    },
    {
      label: "Log Keluar",
      href: "/logout",
    },
  ],

  // Agent navigation items (if you have this role)
  navItemsAgent: [
    {
      label: "Dashboard Agent",
      href: "/agent/dashboard",
    },
    {
      label: "Profil",
      href: "/agent/profile",
    },
    {
      label: "Log Keluar",
      href: "/logout",
    },
  ],

  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
} as const;