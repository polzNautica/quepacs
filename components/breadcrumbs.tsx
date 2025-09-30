import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";

interface BreadcrumbsProps {
  role?: "admin" | "ahli" | "agent" | "public";
  breadcrumbLabel?: string;
}

export default function DynamicBreadcrumbs({
  role = "public",
  breadcrumbLabel,
}: BreadcrumbsProps) {
  const router = useRouter();
  const { asPath, query } = router;

  const getNavItems = () => {
    switch (role) {
      case "admin":
        return siteConfig.navItemsAdmin;
      case "ahli":
        return siteConfig.navItemsAhli;
      case "agent":
        return siteConfig.navItemsAgent;
      default:
        return siteConfig.navItemsPublic;
    }
  };

  const navItems = getNavItems();
  const labelMap = Object.fromEntries(
    navItems.map((item) => [item.href, item.label])
  );

  // Get path parts
  const pathParts = asPath.split("?")[0].split("/").filter(Boolean);
  
  const isLoggedIn = role !== "public";

  // Build crumbs based on role and path
  const crumbs = pathParts.map((part, idx) => {
    // For the first part (role), we need special handling
    if (idx === 0) {
      if (isLoggedIn) {
        // For logged-in users, first crumb should be "Dashboard" pointing to /role/dashboard
        const dashboardHref = `/${role}/dashboard`;
        return {
          href: dashboardHref,
          label: "Dashboard"
        };
      } else {
        // For public users, use normal processing
        const href = "/" + pathParts.slice(0, idx + 1).join("/");
        const label = labelMap[href] || 
          decodeURIComponent(part).charAt(0).toUpperCase() + 
          decodeURIComponent(part).slice(1);
        return { href, label };
      }
    }
    
    // For subsequent parts
    const href = "/" + pathParts.slice(0, idx + 1).join("/");

    let label: string;
    if (labelMap[href]) {
      label = labelMap[href];
    } else if (Object.values(query).includes(part)) {
      label = breadcrumbLabel || String(part);
    } else {
      label =
        decodeURIComponent(part).charAt(0).toUpperCase() +
        decodeURIComponent(part).slice(1);
    }

    return { href, label };
  });

  // Special case: if we're at the role dashboard page (e.g., /admin/dashboard), 
  // don't show breadcrumbs since we only have one item
  if (isLoggedIn && pathParts.length === 2 && pathParts[1] === "dashboard") {
    return null;
  }

  // Don't show breadcrumbs if we only have one meaningful item
  if (crumbs.length <= 1) return null;

  return (
    <Breadcrumbs variant="light" className="mb-4">
      {crumbs.map((crumb, i) => (
        <BreadcrumbItem key={crumb.href} isCurrent={i === crumbs.length - 1}>
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-semibold">{crumb.label}</span>
          ) : (
            <NextLink
              href={crumb.href}
              className="text-foreground/60 hover:text-foreground"
            >
              {crumb.label}
            </NextLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}