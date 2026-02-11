import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarMenus } from "./sidebar-menus";
import { JSX } from "react";
import {
  FileText,
  FolderTree,
  Gift,
  Images,
  LayoutDashboard,
  Package,
  Receipt,
  RotateCw,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard />,
  },
  {
    id: "category",
    label: "Category",
    href: "/admin/category",
    icon: <FolderTree />,
  },
  {
    id: "product",
    label: "Product",
    href: "/admin/product",
    icon: <ShoppingBag />,
  },
  {
    id: "recommended-banners",
    label: "Recommended Banners",
    href: "/admin/recommended-banners",
    icon: <Images />,
  },
  {
    id: "orders",
    label: "Orders",
    href: "/admin/orders",
    icon: <Receipt />,
  },
  {
    id: "spin-orders",
    label: "Spin Orders",
    href: "/admin/spin-orders",
    icon: <RotateCw />,
  },
  {
    id: "spin-packages",
    label: "Spin Packages",
    href: "/admin/spin-packages",
    icon: <Package />,
  },
  {
    id: "spin-users",
    label: "Spin Users",
    href: "/admin/spin-users",
    icon: <Users />,
  },
  {
    id: "spin-slot-images",
    label: "Spin Slot Images",
    href: "/admin/spin-slot-images",
    icon: <Images />,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="pb-12">
      <SidebarHeader className="border-b">
        <div className="flex h-14 items-center px-6">
          <h2 className="text-lg font-semibold tracking-tight truncate">
            Weed Dashboard
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2">
            จัดการแดชบอร์ด
          </SidebarGroupLabel>
          <SidebarGroupContent className="list-none">
            {sidebarItems.map((item) => (
              <SidebarMenus key={item.id} item={item} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
