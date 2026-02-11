import type { LucideIcon } from "lucide-react";
import { Home, Info, Package, ShoppingBag, User, RotateCw } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { title: "หน้าหลัก", href: "/", icon: Home },
  { title: "สินค้าทั้งหมด", href: "/products", icon: Package },
  { title: "คำสั่งซื้อของฉัน", href: "/orders", icon: ShoppingBag },
  { title: "สปิน", href: "/spin", icon: RotateCw },
  { title: "เกี่ยวกับ", href: "/about", icon: User },
  { title: "ติดต่อเรา", href: "/contact", icon: Info },
];

export function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
