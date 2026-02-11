"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { User } from "@/lib/auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "./user-comp";
import {
  selectCartCount,
  selectCartHydrated,
  useCartStore,
} from "@/stores/cart-store";

interface DesktopMenuProps {
  user: User;
  initialCartCount?: number;
}

export function DesktopMenu({ user, initialCartCount = 0 }: DesktopMenuProps) {
  const displayName = user.name?.trim() || user.email || "บัญชีผู้ใช้";
  const avatarAlt = user.name?.trim() || user.email || "User avatar";
  const hydrated = useCartStore(selectCartHydrated);
  const cartCount = useCartStore(selectCartCount);
  const displayCartCount = hydrated ? cartCount : initialCartCount;
  const hasCartItems = Number(displayCartCount) > 0;
  const menuItems = [
    {
      href: "/cart",
      label: "ตะกร้าของฉัน",
      badge: hasCartItems ? displayCartCount : 0,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={displayName} className="gap-2">
          {user.image ? (
            <Image
              alt={avatarAlt}
              src={user.image}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
          <span className="max-w-[12rem] truncate">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            {user.image ? (
              <Image
                alt={avatarAlt}
                src={user.image}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <UserIcon size={24} />
            )}
            <span>{displayName}</span>
          </div>
        </DropdownMenuLabel>

        {menuItems.map(({ href, label, badge }) => (
          <DropdownMenuItem key={href} className="cursor-pointer" asChild>
            <Link href={href} className="flex items-center gap-2">
              <span>{label}</span>
              <Badge className="ml-auto">{badge}</Badge>
            </Link>
          </DropdownMenuItem>
        ))}

        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/admin">หลังบ้าน</Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
