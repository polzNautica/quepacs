import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";

interface BreadcrumbsProps {
  role?: 'admin' | 'ahli' | 'agent' | 'public';
}

export default function DynamicBreadcrumbs({ role = 'public' }: BreadcrumbsProps) {
  const router = useRouter();
  const { pathname } = router;

  // Get navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case 'admin': return siteConfig.navItemsAdmin;
      case 'ahli': return siteConfig.navItemsAhli;
      case 'agent': return siteConfig.navItemsAgent;
      default: return siteConfig.navItemsPublic;
    }
  };

  const navItems = getNavItems().filter(item => item.href !== '#');
  
  // Find current page and dashboard
  const currentItem = navItems.find(item => pathname === item.href);
  const dashboardItem = navItems.find(item => item.href.includes('dashboard')) || navItems[0];

  // Only show breadcrumbs if we have both dashboard and current page, and they're different
  if (!dashboardItem || !currentItem || dashboardItem.href === currentItem.href) {
    return null;
  }

  return (
    <Breadcrumbs variant="light" className="mb-4">
      <BreadcrumbItem>
        <NextLink href={dashboardItem.href} className="text-foreground/60 hover:text-foreground">
          {dashboardItem.label}
        </NextLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrent>
        <span className="text-foreground font-semibold">
          {currentItem.label}
        </span>
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}