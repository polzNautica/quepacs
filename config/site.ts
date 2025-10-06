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
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Pengurusan Pengguna",
      href: "/admin/pengurusanpengguna",
    },
    {
      label: "Notifikasi",
      href: "/admin/notifications",
    },
    {
      label: "Laporan",
      href: "/admin/laporan",
    },
  ],

  // Ahli navigation items
  navItemsAhli: [
    {
      label: "Dashboard",
      href: "/ahli/dashboard",
    },
    {
      label: "Senarai Subkribsi",
      href: "/ahli/subkribsi",
    },
    {
      label: "Notifikasi Testing",
      href: "/test-push-notifications",
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
      href: "/agent/profil",
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