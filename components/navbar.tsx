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
                    "data-[active=true]:text-primary data-[active=true]:font-medium"
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
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        {isAuthenticated && user && (
          <NavbarItem>
            <span className="text-small text-default-500">
              Helo, {user.fullname} ({user.role})
            </span>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
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
          {isAuthenticated && user && (
            <NavbarMenuItem>
              <span className="text-small text-default-500">
                Log masuk sebagai: {user.fullname} ({user.role})
              </span>
            </NavbarMenuItem>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};