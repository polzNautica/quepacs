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
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const { pathname } = router;

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

  // Check if a link is active/selected
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const navItems = getNavItems();

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarMenuToggle className="flex lg:hidden" />
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>

        {/* Desktop Navigation - Only show when authenticated */}
        {isAuthenticated && (
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                {item.href === "/logout" ? (
                  <Link
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer"
                    )}
                    color="foreground"
                    onClick={handleLogout}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <NextLink
                    className={clsx(
                      linkStyles({ color: "foreground" }),
                      "transition-colors duration-200",
                      isLinkActive(item.href) 
                        ? "text-primary font-semibold" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                )}
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      <NavbarContent className="!flex-grow-0 h-full gap-4">
        <ThemeSwitch />
        {!isAuthenticated && (
          <NavbarItem className="hidden lg:flex">
            <div className="hidden lg:flex gap-4">
              <Button 
                variant="ghost" 
                color="primary" 
                className={clsx(
                  "rounded-full",
                  isLinkActive('/login') && "bg-primary/20"
                )}
                size="sm"
              >
                <NextLink 
                  href="/login" 
                  className={clsx(
                    "text-sm gap-2 flex items-center",
                    isLinkActive('/login') ? "text-primary" : "text-primary hover:text-foreground"
                  )}
                >
                  <span>Log Masuk</span>
                  <Icon icon="mdi:login" />
                </NextLink>
              </Button>
              <Button 
                variant="shadow" 
                color="primary" 
                className={clsx(
                  "rounded-full",
                  isLinkActive('/register') && "bg-primary/20"
                )}
                size="sm"
              >
                <NextLink 
                  href="/register" 
                  className={clsx(
                    "text-sm gap-2 flex items-center",
                    isLinkActive('/register') ? "text-foreground" : "text-foreground"
                  )}
                >
                  <span>Daftar Sekarang</span>
                  <Icon icon="mdi:account-plus" />
                </NextLink>
              </Button>
            </div>
          </NavbarItem>
        )}
        {isAuthenticated && user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color={isLinkActive('/profile') ? "primary" : "secondary"}
                size="sm"
                src="https://i.pravatar.cc/150"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="user" textValue="user" isReadOnly>
                <p className="text-xs">
                  {user?.fullname} ({user?.role})
                </p>
                <p className="text-xs text-primary mb-2">{user?.email}</p>
                <Divider />
              </DropdownItem>
              <DropdownItem 
                key="profile" 
                textValue="profile"
                className={isLinkActive('/profile') ? "bg-primary/10" : ""}
              >
                <NextLink href="/profile" className="text-foreground text-sm flex items-center w-full">
                  <Icon icon="mdi:account" />
                  <span className="ml-2">Profil</span>
                </NextLink>
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                textValue="settings"
                className={isLinkActive('/settings') ? "bg-primary/10" : ""}
              >
                <NextLink href="/settings" className="text-foreground text-sm flex items-center w-full">
                  <Icon icon="mdi:cog" />
                  <span className="ml-2">Settings</span>
                </NextLink>
              </DropdownItem>
              <DropdownItem
                key="logout"
                textValue="logout"
                className="text-danger"
              >
                <button
                  onClick={handleLogout}
                  className="text-foreground text-sm flex items-center w-full text-left"
                >
                  <Icon icon="mdi:logout" />
                  <span className="ml-2">Log Keluar</span>
                </button>
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
                <button
                  className={clsx(
                    "w-full text-left p-2 rounded-lg transition-colors",
                    "text-foreground hover:bg-default-100 cursor-pointer"
                  )}
                  onClick={handleLogout}
                >
                  {item.label}
                </button>
              ) : (
                <NextLink
                  href={item.href}
                  className={clsx(
                    "w-full p-2 rounded-lg transition-colors block",
                    isLinkActive(item.href)
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:bg-default-100"
                  )}
                >
                  {item.label}
                </NextLink>
              )}
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};