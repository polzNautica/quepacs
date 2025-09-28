// components/navbar.tsx
import { useAuthStore } from "@/stores/auth-store";
import { siteConfig } from "@/config/site";
import { ROLES } from "@/constants/roles";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  User,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  // Get navigation items based on user role
  const getNavItems = () => {
    if (!isAuthenticated || !user) {
      return siteConfig.navItemsPublic;
    }

    switch (user.role_id) {
      case ROLES.ADMIN:
        return siteConfig.navItemsAdmin;
      case ROLES.AHLI:
        return siteConfig.navItemsAhli;
      case ROLES.AGENT:
        return siteConfig.navItemsAgent;
      default:
        return siteConfig.navItemsPublic;
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const navItems = getNavItems();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="!flex-grow-0 h-full gap-4"
      >
        <ThemeSwitch />
        <NavbarMenuToggle />
        {isAuthenticated && user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                size="sm"
                src="https://i.pravatar.cc/150"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="user" textValue="user">
                <p className="text-xs">
                  {user?.fullname} ({user?.role})
                </p>
                <p className="text-xs text-primary mb-2">{user?.email}</p>
                <Divider />
              </DropdownItem>
              <DropdownItem key="profile" textValue="profile">
                <Link href="/profile" className="text-foreground text-sm">
                  <Icon icon="mdi:account" />
                  <span className="ml-2">Profil</span>
                </Link>
              </DropdownItem>
              <DropdownItem key="settings" textValue="settings">
                <Link href="/settings" className="text-foreground text-sm">
                  <Icon icon="mdi:cog" />
                  <span className="ml-2">Settings</span>
                </Link>
              </DropdownItem>
              <DropdownItem
                key="logout"
                textValue="logout"
                className="text-danger"
              >
                <Link
                  onClick={handleLogout}
                  className="text-foreground text-sm"
                >
                  <Icon icon="mdi:logout" />
                  <span className="ml-2">Log Keluar</span>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              {item.href === "/logout" ? (
                <Link
                  color="foreground"
                  className="w-full cursor-pointer"
                  size="lg"
                  onClick={handleLogout}
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  color="foreground"
                  href={item.href}
                  className="w-full"
                  size="lg"
                >
                  {item.label}
                </Link>
              )}
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
