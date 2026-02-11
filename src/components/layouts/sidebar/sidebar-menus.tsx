"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarItem } from "./index";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SidebarMenus({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar(); // 👈 ดึงฟังก์ชันควบคุม sidebar

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          "w-full justify-start gap-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground",
          {
            "bg-accent text-accent-foreground": pathname === item.href,
          }
        )}
      >
        {/* 👇 เมื่อกดลิงก์ จะปิด sidebar ในมือถือ */}
        <Link
          href={item.href}
          onClick={() => setOpenMobile(false)} // 👈 สั่งปิด sidebar
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
